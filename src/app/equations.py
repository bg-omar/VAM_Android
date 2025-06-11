# Reinitialize constants after execution state reset
import math

import numpy as np
import pandas as pd
import ace_tools_open as tools
from constants import *


# Given the new equations:
# ω = (2 * C_e) / r_c
# B_v = μ_v * (2 * C_e) / r_c
# μ_v = (ρ_ae * r_c^2) / 4

r = r_c
v = C_e
Delta_t = 1
mu_v = (rho_ae * r_c**2) / 4
omega = (2 * C_e) / r_c
B_v = mu_v * omega

# Redefining the necessary physical constants
import pandas as pd

# Helicity values for proton and neutron
H_proton = 14
H_neutron = 16

# Corrected mass calculation
M_proton_corrected = (H_proton * C_e * hbar) / (alpha * c**2 * R_c)
M_neutron_corrected = (H_neutron * C_e * hbar) / (alpha * c**2 * R_c)

# Known values from CODATA
M_p_known = 1.67262192369e-27  # kg
M_n_known = 1.67492749804e-27  # kg

# Creating DataFrame
df_corrected_physical = pd.DataFrame({
    "Particle": ["Proton", "Neutron"],
    "Helicity (H)": [H_proton, H_neutron],
    "Calculated Mass (kg)": [M_proton_corrected, M_neutron_corrected],
    "Known Mass (kg)": [M_p_known, M_n_known]
})

# Display results
tools.display_dataframe_to_user(name="Corrected Mass Calculation with Physical Derivation", dataframe=df_corrected_physical)


# Vortex Energy and Entropy Density
def vortex_energy_density(r, omega, T):
    return (F_Cmax * omega**3) / (C_e * r**2) / (math.exp(h * omega / (k_B * T)) - 1)

def vortex_entropy_density(r, T):
    return (4 * pi**4 * F_Cmax * k_B**4 * T**3) / (45 * C_e * r**2 * h**4)

def vortex_flux_density(r, T):
    return (pi**4 * F_Cmax * k_B**4 * T**4) / (15 * h**4 * r)

def total_energy(T, r):
    return (F_Cmax * T**4) / (C_e * r**2)

def total_entropy(T, r):
    return (F_Cmax * T**3) / (C_e * r**2)


# Einstein field equations
def einstein_field_equations(R_mu_nu, R, g_mu_nu, T_mu_nu):
    return R_mu_nu - 0.5 * R * g_mu_nu - (8 * math.pi * G / c**4) * T_mu_nu

# Vortex tensor
def vortex_tensor(nabla_mu_omega_nu, g_mu_nu, nabla_alpha_omega_alpha):
    return nabla_mu_omega_nu - 0.5 * g_mu_nu * nabla_alpha_omega_alpha

# Adjusted time
def adjusted_time(delta_t, G, M, r, c, J=None):
    if J is None:
        return delta_t * math.sqrt(1 - (2 * G * M) / (r * c**2))
    else:
        return delta_t * math.sqrt(1 - (2 * G * M) / (r * c**2) - (J**2) / (r**3 * c**2))

# Angular momentum
def angular_momentum(M, a):
    return M * a

omega_magnitude = np.linalg.norm(np.gradient(v))

# Vortex energy
def vortex_energy(rho, omega):
    return 0.5 * rho * omega**2

# Gravitational potential
def gravitational_potential(G, M, r):
    return -G * M / r

# Swirl potential
def swirl_potential(C_e, r):
    return -C_e**2 / (2 * r)

# Lense-Thirring precession
def lense_thirring_precession(G, J, c, r):
    return G * J / (c**2 * r**3)

# Swirl angular velocity
def swirl_angular_velocity(C_e, r_c, r):
    return C_e / r_c * math.exp(-r / r_c)

# Circulation
def circulation(v, C):
    return sum(v_i * dl_i for v_i, dl_i in zip(v, C))

# Vortex density
def vortex_density(r):
    return rho_ae * math.exp(-r / R_c)

def M_effective(r):
    from scipy.integrate import quad
    integrand = lambda r_prime: 4 * math.pi * r_prime**2 * vortex_density(r_prime)
    result, _ = quad(integrand, 0, r)
    return result

def M_effective2(r):
    return 4 * math.pi * rho_ae * R_c**3 * (2 - (2 + r / R_c) * math.exp(-r / R_c))


t_adjusted = Delta_t * math.sqrt(1 - (2 * G * M_effective(r)) / (r * c**2) - (C_e**2 / c**2) * math.exp(-r / R_c) - (omega_magnitude**2 / c**2) * math.exp(-r / R_c))
t_adjusted2 = Delta_t * math.sqrt(1 - (2 * G * M_effective2(r)) / (r * c**2) - (C_e**2 / c**2) * math.exp(-r / R_c) - (omega_magnitude**2 / c**2) * math.exp(-r / R_c))
print ("Adjusted time:", t_adjusted)
print ("Adjusted time2:", t_adjusted2)

lambda_c = h / (M_e * c)
print("lambda_c: ", lambda_c)
f_e = (M_e * c**2) / h
print("f_e: ", f_e)
omega_c = (M_e * c**2) / hbar
print("omega_c: ", omega_c)

print("\nM_e: ", M_e)
print((2 * F_max * R_c) / c**2)

# Formulas translated into Python
print("\na_0: ",a_0)
print(((c**2 * R_c) / (2 * C_e**2)))
print(((F_max * R_c**2) / (M_e * C_e**2)))
print(((4 * pi * varepsilon_0 * hbar**2) / (M_e * e**2)))
print(((h) / (4 * pi * M_e * C_e)))

print("\nR_squared", a_0**2)
print((h) / (4 * pi**2 * f_c * M_e * alpha**2))
print((c**2 * R_c) / (2 * pi * f_c * C_e * alpha**2))
print(((4 * pi * F_max * R_c**2) / (C_e)) * (1 /(4 * pi**2 * M_e * f_c * alpha**2)))

print("\nR_e: ",R_e)
print((e**2) / (4 * pi * varepsilon_0 * M_e * c**2))
print(2 * R_c)
print(alpha**2 * a_0)
print((e**2) / (4 * pi * varepsilon_0 * M_e * c**2))
print((e**2) / (8 * pi * varepsilon_0 * F_max * R_c))

print("\ne: ",e)
print(math.sqrt(16 * pi * F_max * R_c**2 * varepsilon_0))
print(math.sqrt((2 * alpha * h * varepsilon_0 * c) ))
print(math.sqrt(4 * C_e * h * varepsilon_0))

print("\nL_p: ",L_p)
print(math.sqrt(h * G / c**3)) ###########################################
print(math.sqrt((alpha_g * h * R_c) / (C_e * M_e))) ###########################################
print(math.sqrt((h * t_p**2 * C_e * c**2) / (2 * F_max * R_c**2))) ###########################################

print("\nalpha_g: ",alpha_g)
print((2 * F_max * C_e * t_p**2) / ((2 * F_max * R_c**2) / C_e))
print((C_e**2 * t_p**2) / (R_c**2))
print((C_e**2 * L_p**2) / (R_c**2 * c**2))
print((F_max * t_p**2) / (a_0 * M_e))
print((C_e * c**2 * t_p**2 * M_e) / (h * R_c)) ###########################################
print((F_max * 2 * C_e * t_p**2) / h)  ###########################################

print("\nG: ",G)
print((C_e * c**3 * L_p**2) / (2 * F_max * R_c**2))
print((C_e * c**3 * t_p**2) / (R_c * M_e))
print((F_max * alpha * (c * t_p)**2) / (M_e**2))
print((C_e * c * L_p**2) / (R_c * M_e))
print((alpha_g * c**3 * R_c) / (C_e * M_e))
print((C_e * c**5 * t_p**2) / (2 * F_max * R_c**2))
print((c**4) / (4 * F_GRmax))

print("\nalpha: ", alpha)
print((C_e * e**2) / (8 * pi * varepsilon_0 * R_c**2 * c * F_max))
print((h / (4 * pi * R_c))) ###########################################
print((lambda_c * R_c) / (2 * C_e)) ###########################################

print("\nlambda_c: ",lambda_c)
print((2 * pi * c * R_c) / C_e)
print((4 * pi * F_max * R_c**2) / (C_e * M_e * c))

print("\nC_e: ",C_e)
print(c * (alpha/2))
print(h / (2 * pi * M_e * R_c))

print("\nR_c: ",R_c)
print(R_e / 2)

rho_ae = 4 * F_max / (math.pi * alpha**2 * c**2 * r_c**2)
print("rho_ae: ", rho_ae)
print("rho_ae_A: ", rho_ae_A)
print("rho_ae_V: ", rho_ae_V)

print("\nF_Cmax: ",F_Cmax)
print((c**4 / (4 * G)) * alpha * (R_c / L_p)**-2)
print((C_e * hbar) / (2 * r_c**2))
print((h * alpha * c) / (8 * pi * R_c**2))
print(e**2 / (16 * pi * varepsilon_0 * R_c**2))
print(math.pi  * r_c**2 * (rho_ae * C_e**2))
print((M_e * C_e**2) /  R_c) ###########################################
print((mu_v / (4 * math.pi)) * ((mu_v * omega) ** 2 / r_c**2))###########################################
print((mu_v / (4 * math.pi)) * ((mu_v * (2 * C_e / r_c)) ** 2 / r_c**2))###########################################

print("\nh: ",h)
print(4 * pi * M_e * C_e * a_0)
print((pi * F_max * R_e**2) / C_e)
print((96 * pi * F_max**2 * R_c**3 * a_0) / (h * c**2))
print( 2*alpha * M_e * C_e**2 * R_c)###########################################


Gamma = C_e * lambda_p
print("\n Gamma = C_e * lambda_p: ", Gamma)

print("\nR_infinity: ",R_)
print((C_e**3) / (pi * R_c * c**3))

print((Gamma**3)*(pi * R_c * c**3))

E_vortex = (1/2) *  rho_ae * Gamma**2 * R_c


print("rho_ae: ", rho_ae)
rho_ae = F_max / (math.pi * C_e**2 * r_c**2)
print("rho_ae: ", rho_ae)
print("E_vortex = (1/2) *  rho_ae**2 * Gamma**2 * R: ", E_vortex)

J_Mev = 6.242 * 10**12
print("1 J = 6.242e12 MeV: ", 6.242 * 10**12)

gamma = C_e * 2 * math.pi * r_c
print("gamma = ", gamma)
m_eff = (rho_ae * gamma**2 ) / (3 * math.pi * r_c * c**2)
print("m_eff: ", m_eff)

print(8 * math.pi * rho_ae * r_c* C_e * 3)
print (h)

# Fundamental VAM Constants
M_e = 9.1093837015e-31    # kg
C_e = 1.09384563e6        # m/s
r_c = 1.40897017e-15      # m

# Empirical Planck constant
hbar_empirical = 1.054571817e-34  # J·s

# Define proportionality constant
kappa_vam = hbar_empirical / (M_e * C_e * r_c)

# Print
print("kappa_vam ≈", kappa_vam)

print("Electron Mass: ", M_e)
print(((8 * math.pi * rho_ae * r_c**3) / C_e)  * 3)

print("Proton Mass: ", M_pr)
print(((8 * math.pi * rho_ae * r_c**3 * C_e) / c) * 1.618033988749895)  # Using the golden ratio


# Derived Planck constant formula from vortex dynamics:
hbar_vortex = math.sqrt((2 * M_e * F_max * r_c**3) / (5 * lambda_c * C_e))
print("hbar (from vortex dynamics):", hbar_vortex)


lhs=(F_max * r_c**3) / (5 * lambda_c * C_e)
rhs= (hbar**2) / (2 * M_e )
print("Left-hand side (LHS):", lhs)
print("Right-hand side (RHS):", rhs)

# Schrödinger equation from vortex dynamics (operator form):
# i * hbar * dψ/dt = - (F_max * r_c**3) / (5 * lambda_c * C_e) * ∇²ψ + Vψ
# This can be implemented as a function for a given ψ, V, and spatial operator (Laplacian):

def schrodinger_rhs(psi, V, laplacian_psi, hbar=hbar_vortex):
    """Right-hand side of the Schrödinger equation from vortex dynamics."""
    coeff = (F_max * r_c**3) / (5 * lambda_c * C_e)
    return -1j * (coeff * laplacian_psi + V * psi) / hbar