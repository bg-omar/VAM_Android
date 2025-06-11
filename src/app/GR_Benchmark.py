import pandas as pd
import math
import ace_tools_open as tools
from constants import *

pd.set_option('display.max_columns', None)
pd.set_option('display.width', None)
# Constants
M_sun = 1.98847e30  # kg
# Prepare results
results = []

# Benchmark cases
benchmark_cases = [
    {
        "name": "Electron",
        "mass": 9.1093837015e-31,
        "radius": 2.8179403262e-15,  # classical electron radius
        "J": hbar * (3/4)**0.5  # spin-1/2
    },
    {
        "name": "Proton",
        "mass": 1.67262192369e-27,
        "radius": 0.84e-15,  # estimated charge radius
        "J": hbar * (3/4)**0.5
    },
    {
        "name": "Earth",
        "mass": 5.972e24,
        "radius": 6.371e6,
        "J": 7.07e33  # known value of Earth's angular momentum (kg m^2/s)
    },
    {
        "name": "Sun",
        "mass": M_sun,
        "radius": 6.9634e8,
        "rotation_freq": 1.997e-6  # rad/s (average)
    },
    {
        "name": "Neutron Star",
        "mass": 1.4 * M_sun,
        "radius": 1e4,  # 10 km
        "rotation_freq": 700  # Hz
    }
]

observational_additions = {
    "Electron": {
        "Obs Orbital dτ/dt": 1.0,
        "Obs Ω_eff (rad/s)": None,
        "Obs Ω_LT (rad/s)": None,
    },
    "Proton": {
        "Obs Orbital dτ/dt": 1.0,
        "Obs Ω_eff (rad/s)": None,
        "Obs Ω_LT (rad/s)": None,
    },
    "Earth": {
        "Obs Orbital dτ/dt": 7910,  # based on GPS orbital frame approx
        "Obs Ω_eff (rad/s)": 0.00124,
        "Obs Ω_LT (rad/s)": 3.03e-14,
    },
    "Neutron Star": {
        "Obs Orbital dτ/dt": 1.3e8,  # estimate based on known spin and frame dragging
        "Obs Ω_eff (rad/s)": 12900,
        "Obs Ω_LT (rad/s)": 700,
    },
    "Sun": {
        "Obs Orbital dτ/dt": 4.37e5,  # based on Keplerian orbit near surface
        "Obs Ω_eff (rad/s)": 0.000627,
        "Obs Ω_LT (rad/s)": 2.0e-11,
    }
}
# Add known observational data (either measured or theoretically predicted and validated)
Obs_data = {
    "Earth": {
        "Obs_dτ/dt": 1 - 6.97e-10,  # gravitational time dilation at surface
        "Obs_Ω_LT": 3.03e-14,  # rad/s, Gravity Probe B result (GP-B paper)
    },
    "Sun": {
        "Obs_dτ/dt": 0.9999979,  # Solar gravitational redshift
        "Obs_Ω_LT": 2.0e-11,  # theoretical expectation for solar frame-dragging (no direct measurement)
    },
    "Neutron Star": {
        "Obs_dτ/dt": 0.76,  # from gravitational redshift in X-ray burst spectra
        "Obs_Ω_LT": 700.0,  # theoretical expectation based on millisecond pulsars
    },
    "Electron": {
        "Obs_dτ/dt": None,
        "Obs_Ω_LT": None,
    },
    "Proton": {
        "Obs_dτ/dt": 1.0,
        "Obs_Ω_LT": None,
    }
}
# Define the preferred column order for clarity
preferred_column_order = [
    "Object",
    "Mass (kg)",
    "Radius (m)",
    "J (kg·m²/s)",
    "Schwarz Term",
    "Spin Term",
    "dτ/dt",
    "Obs dτ/dt",
    "Orbital dτ/dt",
    "Obs Orbital dτ/dt",
    "Ω_eff (rad/s)",
    "Obs Ω_eff (rad/s)",
    "Ω_LT (rad/s)",
    "Obs Ω_LT (rad/s)",
    "GeoPrec (rad/s)",
    "GeoPrec (arcsec/yr)",
    "LT Prec (rad/s)",
    "LT Prec (arcsec/yr)"
]
# GR Observable Functions
def schwarzschild_precession(M, a, e):
    return (6 * math.pi * G * M) / (a * (1 - e**2) * c**2)

def shapiro_delay(M, r1, r2, b):
    return (2 * G * M / c**3) * math.log((4 * r1 * r2) / b**2)

def light_deflection(M, R):
    return (4 * G * M) / (R * c**2)

def isco_radius(M, a=0):
    return 6 * G * M / c**2  # Schwarzschild case

def gw_inspiral_period_derivative(m1, m2, a):
    μ = m1 * m2 / (m1 + m2)
    M = m1 + m2
    return -(192 * math.pi * G**(5/3) * μ * M**(2/3)) / (5 * c**5 * a**(5/2))

def geodetic_precession(M, R, v_orbit):
    return (3 * G * M * v_orbit) / (2 * c**2 * R**2)

def lense_thirring_precession(J, R):
    return (2 * G * J) / (c**2 * R**3)

def flrw_cosmological_redshift(a_emit, a_obs=1.0):
    return (a_obs / a_emit) - 1

def flrw_scale_factor_from_z(z):
    return 1 / (1 + z)

def orbital_time_dilation(mass, radius, J):
    Omega_K = math.sqrt(G * mass / radius**3)
    Omega_LT = (2 * G * J) / (c**2 * radius**3)
    Omega = Omega_K - Omega_LT

    g_tt = -(1 - (2 * G * mass) / (radius * c**2))
    g_tphi = - (2 * G * J) / (radius * c**3)
    g_phiphi = radius**2

    term = g_tt + 2 * g_tphi * Omega + g_phiphi * Omega**2
    return math.sqrt(term) if term > 0 else float('nan'), Omega, Omega_LT

def compute_gr_properties(name, mass, radius, J=None, rotation_freq=None):
    if J is None and rotation_freq is not None:
        omega = 2 * math.pi * rotation_freq
        I = (2 / 5) * mass * radius**2
        J = I * omega

    schwarz_term = (2 * G * mass) / (radius * c**2)
    spin_term = (G**2 * J**2) / (radius**4 * c**6)
    total_term = 1 - schwarz_term + spin_term
    tau_over_t = math.sqrt(total_term) if total_term > 0 else float('nan')

    tau_orb, omega_eff, omega_LT = (orbital_time_dilation(mass, radius, J)
                                     if name in ["Earth", "Sun", "Neutron Star"]
                                     else (None, None, None))

    return {
        "Object": name,
        "Mass (kg)": mass,
        "Radius (m)": radius,
        "J (kg·m²/s)": J,
        "Schwarz Term": schwarz_term,
        "Spin Term": spin_term,
        "dτ/dt": tau_over_t,
        "Orbital dτ/dt": tau_orb,
        "Ω_eff (rad/s)": omega_eff,
        "Ω_LT (rad/s)": omega_LT,
    }

def merge_observations(entry, obs_dτ, obs_orbital, obs_omega_eff, obs_lt):
    entry["Obs dτ/dt"] = obs_dτ.get(entry["Object"], {}).get("Obs_dτ/dt", None)
    entry["Obs Ω_LT (rad/s)"] = obs_dτ.get(entry["Object"], {}).get("Obs_Ω_LT", None)
    entry["Obs Orbital dτ/dt"] = obs_orbital.get(entry["Object"], {}).get("Obs Orbital dτ/dt", None)
    entry["Obs Ω_eff (rad/s)"] = obs_orbital.get(entry["Object"], {}).get("Obs Ω_eff (rad/s)", None)
    entry["Obs Ω_LT (rad/s)"] = obs_orbital.get(entry["Object"], {}).get("Obs Ω_LT (rad/s)", None)

def add_precession_terms(entry):
    if entry["Object"] == "Earth":
        R_orbit = entry["Radius (m)"] + 400e3
        v_orbit = 7660
        geo = geodetic_precession(entry["Mass (kg)"], R_orbit, v_orbit)
        lt = lense_thirring_precession(entry["J (kg·m²/s)"], R_orbit)
        entry["GeoPrec (rad/s)"] = geo
        entry["GeoPrec (arcsec/yr)"] = math.degrees(geo) * 3600 * 24 * 3600 * 365.25
        entry["LT Prec (rad/s)"] = lt
        entry["LT Prec (arcsec/yr)"] = math.degrees(lt) * 3600 * 24 * 3600 * 365.25
    else:
        entry["GeoPrec (rad/s)"] = None
        entry["GeoPrec (arcsec/yr)"] = None
        entry["LT Prec (rad/s)"] = None
        entry["LT Prec (arcsec/yr)"] = None

results_GR_Benchmark = []
for case in benchmark_cases:
    name = case["name"]
    mass = case["mass"]
    radius = case["radius"]
    J = case.get("J", None)
    freq = case.get("rotation_freq", None)

    entry = compute_gr_properties(name, mass, radius, J, freq)
    merge_observations(entry, Obs_data, observational_additions, observational_additions, observational_additions)

    results_GR_Benchmark.append(entry)

for entry in results_GR_Benchmark:
    add_precession_terms(entry)

pd.set_option('display.float_format', '\t{:.8e}'.format)
df = pd.DataFrame(results_GR_Benchmark)[preferred_column_order]
tools.display_dataframe_to_user(name="Extended GR Benchmark", dataframe=df.transpose())






