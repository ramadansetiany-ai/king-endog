/**
 * KING ENDOG - Google Authentication & OAuth Flow Controller
 * Meniru flow otentikasi Google Account Chooser & OAuth Consent persis seperti link Google resmi
 */

const KingAuth = {
    STORAGE_KEY: "king_endog_user",
    pendingUser: null,

    init() {
        this.checkSession();
        this.initOfficialGoogleSdk();
    },

    checkSession() {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
            try {
                const user = JSON.parse(stored);
                this.renderLoggedInUser(user);
                return;
            } catch (e) {
                localStorage.removeItem(this.STORAGE_KEY);
            }
        }
        this.showLoginScreen();
    },

    showLoginScreen() {
        document.getElementById("screen-google-auth")?.classList.remove("hidden");
        document.getElementById("screen-main-app")?.classList.add("hidden");
        document.getElementById("auth-step-chooser")?.classList.remove("hidden");
        document.getElementById("auth-step-consent")?.classList.add("hidden");
    },

    // Step 1: User memilih akun dari Google Account Chooser
    selectAccount(type) {
        if (type === 'pribadi') {
            this.pendingUser = {
                id: "google-usr-10928374",
                name: "Peternak Pribadi (Owner)",
                email: "kingendog.owner@gmail.com",
                picture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
                role: "Pemilik King Endog"
            };
        } else {
            this.pendingUser = {
                id: "google-usr-88273641",
                name: "Akun Google Saya",
                email: "pengguna.hp@gmail.com",
                picture: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
                role: "Peternak Mandiri"
            };
        }

        // Tampilkan layar persetujuan OAuth (seperti skrip/URL awal)
        this.showConsentStep(this.pendingUser);
    },

    toggleCustomEmailInput() {
        const box = document.getElementById("custom-email-box");
        if (box) {
            box.classList.toggle("hidden");
            if (!box.classList.contains("hidden")) {
                document.getElementById("input-custom-email")?.focus();
            }
        }
    },

    submitCustomEmail() {
        const input = document.getElementById("input-custom-email");
        const email = input?.value.trim();
        if (!email || !email.includes("@")) {
            KingApp.showToast("Masukkan alamat email Google yang valid!", "warning");
            return;
        }

        const nameFromEmail = email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, l => l.toUpperCase());

        this.pendingUser = {
            id: `google-custom-${Date.now()}`,
            name: nameFromEmail,
            email: email,
            picture: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
            role: "Pengguna Pribadi"
        };

        this.showConsentStep(this.pendingUser);
    },

    // Step 2: Layar Izin OAuth
    showConsentStep(user) {
        const chooser = document.getElementById("auth-step-chooser");
        const consent = document.getElementById("auth-step-consent");
        const emailLabel = document.getElementById("consent-target-email");

        if (chooser) chooser.classList.add("hidden");
        if (consent) consent.classList.remove("hidden");
        if (emailLabel) emailLabel.textContent = user.email;
    },

    cancelConsent() {
        this.pendingUser = null;
        const chooser = document.getElementById("auth-step-chooser");
        const consent = document.getElementById("auth-step-consent");
        if (consent) consent.classList.add("hidden");
        if (chooser) chooser.classList.remove("hidden");
    },

    // Step 3: Konfirmasi Persetujuan dan Masuk ke Aplikasi Utama
    confirmConsent() {
        if (!this.pendingUser) return;

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.pendingUser));
        KingApp.showToast(`Berhasil masuk sebagai ${this.pendingUser.name}! 👑`, "success");
        this.renderLoggedInUser(this.pendingUser);
        this.pendingUser = null;
    },

    renderLoggedInUser(user) {
        document.getElementById("screen-google-auth")?.classList.add("hidden");
        document.getElementById("screen-main-app")?.classList.remove("hidden");

        // Set user info di header & tab akun
        const userAvatar = document.getElementById("app-user-avatar");
        const userName = document.getElementById("app-user-name");
        const detailAvatar = document.getElementById("detail-user-avatar");
        const detailName = document.getElementById("detail-user-name");
        const detailEmail = document.getElementById("detail-user-email");

        if (userAvatar) userAvatar.src = user.picture;
        if (userName) userName.textContent = user.name;
        if (detailAvatar) detailAvatar.src = user.picture;
        if (detailName) detailName.textContent = user.name;
        if (detailEmail) detailEmail.textContent = user.email;

        KingApp.onUserLoggedIn();
    },

    logout() {
        localStorage.removeItem(this.STORAGE_KEY);
        this.showLoginScreen();
        KingApp.showToast("Anda telah keluar dari akun Google.", "info");
    },

    getCurrentUser() {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
    },

    // Integrasi SDK Resmi Google Identity Services
    initOfficialGoogleSdk() {
        if (window.google && window.google.accounts && window.google.accounts.id) {
            try {
                google.accounts.id.initialize({
                    client_id: "1071006060591-tmhssin2h21lcre235vtolojh4g403ep.apps.googleusercontent.com",
                    callback: this.handleGoogleCredentialResponse.bind(this),
                    auto_select: false
                });

                const container = document.getElementById("g_id_signin_container");
                if (container) {
                    google.accounts.id.renderButton(container, {
                        theme: "outline",
                        size: "medium",
                        shape: "pill",
                        text: "signin_with",
                        width: 240
                    });
                }
            } catch (e) {
                console.log("Google SDK local init note:", e);
            }
        } else {
            setTimeout(() => this.initOfficialGoogleSdk(), 1000);
        }
    },

    handleGoogleCredentialResponse(response) {
        if (!response || !response.credential) return;

        // Decode JWT token Google
        try {
            const base64Url = response.credential.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const payload = JSON.parse(decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')));

            const user = {
                id: payload.sub,
                name: payload.name || "Pengguna Google",
                email: payload.email,
                picture: payload.picture || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
                role: "Peternak Pribadi"
            };

            this.pendingUser = user;
            this.showConsentStep(user);
        } catch (err) {
            console.error("Parse JWT error:", err);
        }
    }
};

window.KingAuth = KingAuth;
