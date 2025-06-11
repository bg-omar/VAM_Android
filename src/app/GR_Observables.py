# Starter Python module: GR_Observables.py

import math

# Constants
G = 6.67430e-11         # gravitational constant [m^3 kg^-1 s^-2]
c = 299792458           # speed of light [m/s]
pi = math.pi

def schwarzschild_precession(M, a, e):
    """
    Compute the relativistic perihelion advance per orbit.

    Parameters:
    M: central mass [kg]
    a: semi-major axis [m]
    e: eccentricity

    Returns:
    Precession per orbit [radians]
    """
    return (6 * pi * G * M) / (a * (1 - e**2) * c**2)

def shapiro_delay(M, r1, r2, b):
    """
    Compute the Shapiro time delay of light/signal near a massive object.

    Parameters:
    M: central mass [kg]
    r1, r2: distances from source and observer to mass [m]
    b: impact parameter [m]

    Returns:
    Time delay [seconds]
    """
    return (2 * G * M / c**3) * math.log((4 * r1 * r2) / b**2)

def light_deflection(M, R):
    """
    Compute the total light deflection angle near a mass.

    Parameters:
    M: mass causing deflection [kg]
    R: closest approach distance [m]

    Returns:
    Deflection angle [radians]
    """
    return (4 * G * M) / (R * c**2)

def isco_radius(M, a=0):
    """
    Compute the radius of the innermost stable circular orbit (ISCO).

    Parameters:
    M: mass [kg]
    a: spin parameter [m], default = 0 (Schwarzschild)

    Returns:
    ISCO radius [m]
    """
    r_s = 2 * G * M / c**2
    if a == 0:
        return 6 * G * M / c**2
    else:
        # Use exact solution for Kerr ISCO (prograde only, simplified)
        Z1 = 1 + (1 - (a / (G * M / c**2))**2)**(1/3) * (
                (1 + a / (G * M / c**2))**(1/3) + (1 - a / (G * M / c**2))**(1/3)
        )
        Z2 = (3 * a**2 / (G * M / c**2)**2 + Z1**2)**0.5
        return G * M / c**2 * (3 + Z2 - ((3 - Z1) * (3 + Z1 + 2 * Z2))**0.5)

def gw_inspiral_period_derivative(m1, m2, a):
    """
    Compute the rate of change of orbital period due to gravitational radiation.

    Parameters:
    m1, m2: masses [kg]
    a: orbital separation [m]

    Returns:
    Period derivative dP/dt [s/s]
    """
    mu = m1 * m2 / (m1 + m2)
    M = m1 + m2
    return - (192 * pi * G**(5/3) * mu * M**(2/3)) / (5 * c**5 * a**(5/2))

# Extending the GR_Observables module with:
# 1. Cosmological redshift from FLRW metric
# 2. Geodetic and Lense–Thirring precession

# Append to the module

def flrw_cosmological_redshift(a_emit, a_obs=1.0):
    """
    Compute the cosmological redshift from FLRW metric.

    Parameters:
    a_emit: scale factor at emission (e.g. 1/(1+z_emit))
    a_obs: scale factor at observation (default = 1, today)

    Returns:
    Redshift z
    """
    return (a_obs / a_emit) - 1

def flrw_scale_factor_from_z(z):
    """
    Compute scale factor from redshift.

    Parameters:
    z: redshift

    Returns:
    Scale factor a
    """
    return 1 / (1 + z)

def geodetic_precession(M, R, v_orbit):
    """
    Compute the geodetic precession (de Sitter effect).

    Parameters:
    M: central mass [kg]
    R: orbital radius [m]
    v_orbit: orbital velocity [m/s]

    Returns:
    Precession rate [rad/s]
    """
    return (3 * G * M * v_orbit) / (2 * c**2 * R**2)

def lense_thirring_precession(J, R):
    """
    Compute the Lense–Thirring precession (frame dragging).

    Parameters:
    J: angular momentum of central mass [kg·m²/s]
    R: radial distance from rotation axis [m]

    Returns:
    Frame-dragging precession rate [rad/s]
    """
    return (2 * G * J) / (c**2 * R**3)

# Example usage
if __name__ == "__main__":
    # Mercury-like test
    M_sun = 1.98847e30
    a_mercury = 5.791e10
    e_mercury = 0.2056

    delta_phi = schwarzschild_precession(M_sun, a_mercury, e_mercury)
    print("Mercury perihelion precession per orbit (rad):", delta_phi)

    # Light deflection near Sun
    R_sun = 6.9634e8
    alpha = light_deflection(M_sun, R_sun)
    print("Light deflection near Sun (arcseconds):", math.degrees(alpha) * 3600)

    print("\n--- Cosmological Redshift Example ---")
    z = flrw_cosmological_redshift(a_emit=0.5)
    print("Redshift from a_emit=0.5:", z)

    print("\n--- Geodetic Precession (Earth Orbit) ---")
    M_earth = 5.972e24
    R_orbit = 6.371e6 + 400e3  # e.g., LEO satellite
    v_orbit = 7.66e3  # m/s (LEO velocity)
    omega_geo = geodetic_precession(M_earth, R_orbit, v_orbit)
    print("Geodetic precession rate (rad/s):", omega_geo)
    print("≈", math.degrees(omega_geo) * 3600, "arcsec/year")

    print("\n--- Lense–Thirring Precession (Earth) ---")
    J_earth = 7.07e33  # kg m²/s
    omega_LT = lense_thirring_precession(J_earth, R_orbit)
    print("Lense–Thirring precession rate (rad/s):", omega_LT)
    print("≈", math.degrees(omega_LT) * 3600, "arcsec/year")