# Extended GR + VAM Benchmark Script
import pandas as pd
import math
import ace_tools_open as tools


pd.set_option('display.max_columns', None)
pd.set_option('display.width', None)
pd.set_option('display.float_format', '\t{:.8e}'.format)

# Constants
G = 6.67430e-11  # m^3 kg^-1 s^-2, gravitational constant
M_sun = 1.98847e30  # kg
hbar = 1.0545718e-34  # J·s, reduced Planck's constant
c = 299792458
Ce = 1.0938456e6
rc = 1.40897017e-15
rho_ae = 3.8934358266918687e+18
alpha = 7.2973525693e-3
Lp = 1.616255e-35
t_p = 5.391247e-44
Fmax_vam = (c**4 / (4 * G)) * alpha * (rc / Lp)**2

# Preferred column order
preferred_column_order = [
    "Object", "Mass (kg)", "Radius (m)", "J (kg·m²/s)", "Schwarz Term", "Spin Term",
    "GR dτ/dt", "VAM dτ/dt", "Obs dτ/dt",
    "GR Orbital dτ/dt", "VAM Orbital dτ/dt", "Obs Orbital dτ/dt",
    "GR Ω_eff (rad/s)", "VAM Ω_eff (rad/s)", "Obs Ω_eff (rad/s)",
    "GR Ω_LT (rad/s)", "VAM Ω_LT (rad/s)", "Obs Ω_LT (rad/s)",
    "GR GeoPrec (rad/s)", "VAM GeoPrec (rad/s)", "GeoPrec (arcsec/yr)",
    "GR LT Prec (rad/s)", "VAM LT Prec (rad/s)", "LT Prec (arcsec/yr)"
]
# Benchmark cases
benchmark_cases = [
    {"name": "Electron", "mass": 9.1093837015e-31, "radius": 2.8179403262e-15, "J": hbar * (3/4)**0.5},
    {"name": "Proton", "mass": 1.67262192369e-27, "radius": 0.84e-15, "J": hbar * (3/4)**0.5},
    {"name": "Earth", "mass": 5.972e24, "radius": 6.371e6, "J": 7.07e33},
    {"name": "Sun", "mass": M_sun, "radius": 6.9634e8, "rotation_freq": 1.997e-6},
    {"name": "Neutron Star", "mass": 1.4 * M_sun, "radius": 1e4, "rotation_freq": 700}
]

# Observational data
Obs_data = {
    "Electron": {"Obs_dτ/dt": None, "Obs_Ω_LT": None},
    "Proton": {"Obs_dτ/dt": 1.0, "Obs_Ω_LT": None},
    "Earth": {"Obs_dτ/dt": 1 - 6.97e-10, "Obs_Ω_LT": 3.03e-14},
    "Sun": {"Obs_dτ/dt": 0.9999979, "Obs_Ω_LT": 2.0e-11},
    "Neutron Star": {"Obs_dτ/dt": 0.76, "Obs_Ω_LT": 700.0}
}

observational_additions = {
    "Electron": {"Obs Orbital dτ/dt": 1.0, "Obs Ω_eff (rad/s)": None, "Obs Ω_LT (rad/s)": None},
    "Proton": {"Obs Orbital dτ/dt": 1.0, "Obs Ω_eff (rad/s)": None, "Obs Ω_LT (rad/s)": None},
    "Earth": {"Obs Orbital dτ/dt": 7910, "Obs Ω_eff (rad/s)": 0.00124, "Obs Ω_LT (rad/s)": 3.03e-14},
    "Sun": {"Obs Orbital dτ/dt": 4.37e5, "Obs Ω_eff (rad/s)": 0.000627, "Obs Ω_LT (rad/s)": 2.0e-11},
    "Neutron Star": {"Obs Orbital dτ/dt": 1.3e8, "Obs Ω_eff (rad/s)": 12900, "Obs Ω_LT (rad/s)": 700}
}

# GR and VAM functions
def geodetic_precession(M, R, v_orbit):
    return (3 * G * M * v_orbit) / (2 * c**2 * R**2)

def lense_thirring_precession(J, R):
    return (2 * G * J) / (c**2 * R**3)

def orbital_time_dilation(mass, radius, J):
    Omega_K = math.sqrt(G * mass / radius**3)
    Omega_LT = (2 * G * J) / (c**2 * radius**3)
    Omega = Omega_K - Omega_LT
    g_tt = -(1 - (2 * G * mass) / (radius * c**2))
    g_tphi = - (2 * G * J) / (radius * c**3)
    g_phiphi = radius**2
    term = g_tt + 2 * g_tphi * Omega + g_phiphi * Omega**2
    return math.sqrt(term) if term > 0 else float('nan'), Omega, Omega_LT

def G_swirl():
    F_max = (c**4 / (4 * G)) * alpha * (rc / Lp)**-2
    return (Ce * c**5 * t_p**2) / (2 * F_max * rc**2)

def vam_effective_mass(r, Rc):
    return 4 * math.pi * rho_ae * Rc**3 * (2 - (2 + r / Rc) * math.exp(-r / Rc))

def vam_adjusted_time_hybrid(r, omega=0, mass=None):
    R0 = 1e-12
    mu = math.exp(- (r / R0)**2)
    M_eff_vam = vam_effective_mass(r, rc)
    M_eff = mu * M_eff_vam + (1 - mu) * mass
    G_local = mu * G_swirl() + (1 - mu) * G
    swirl_term = (Ce**2 / c**2) * math.exp(-r / rc)
    omega_term = (omega**2 / c**2) * math.exp(-r / rc)
    term = 1 - (2 * G_local * M_eff) / (r * c**2) - swirl_term - omega_term
    return math.sqrt(term) if term > 1e-12 else float('nan')

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
        "Object": name, "Mass (kg)": mass, "Radius (m)": radius, "J (kg·m²/s)": J,
        "Schwarz Term": schwarz_term, "Spin Term": spin_term, "GR dτ/dt": tau_over_t,
        "GR Orbital dτ/dt": tau_orb, "GR Ω_eff (rad/s)": omega_eff, "Ω_LT (rad/s)": omega_LT
    }

def merge_observations(entry):
    name = entry["Object"]
    entry["Obs dτ/dt"] = Obs_data[name].get("Obs_dτ/dt")
    entry["Obs Ω_LT (rad/s)"] = Obs_data[name].get("Obs_Ω_LT")
    entry["Obs Orbital dτ/dt"] = observational_additions[name].get("Obs Orbital dτ/dt")
    entry["Obs Ω_eff (rad/s)"] = observational_additions[name].get("Obs Ω_eff (rad/s)")

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

# Build results
results = []
for case in benchmark_cases:
    name = case["name"]
    mass = case["mass"]
    radius = case["radius"]
    J = case.get("J")
    freq = case.get("rotation_freq")
    omega = 2 * math.pi * freq if freq else 0

    entry = compute_gr_properties(name, mass, radius, J, freq)
    entry["GR Ω_LT (rad/s)"] = entry.pop("Ω_LT (rad/s)")
    entry["VAM dτ/dt"] = vam_adjusted_time_hybrid(radius, omega, mass)
    entry["VAM Orbital dτ/dt"] = None
    entry["VAM Ω_eff (rad/s)"] = None
    entry["VAM Ω_LT (rad/s)"] = None
    entry["VAM GeoPrec (rad/s)"] = None
    entry["VAM LT Prec (rad/s)"] = None

    merge_observations(entry)
    add_precession_terms(entry)

    entry["GR GeoPrec (rad/s)"] = entry.pop("GeoPrec (rad/s)")
    entry["GR LT Prec (rad/s)"] = entry.pop("LT Prec (rad/s)")

    results.append(entry)


# Output DataFrame
columns = [col for col in preferred_column_order if col in pd.DataFrame(results).columns]
df = pd.DataFrame(results)[columns]
tools.display_dataframe_to_user(name="Extended GR + VAM Benchmark", dataframe=df.transpose())
