// Dark Mode Toggle
function toggleMode() {
  document.body.classList.toggle('dark');
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
}
window.onload = () => {
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
  }
  loadRefunds?.(); // If on dashboard
};

// Signup Function
function signup() {
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      userCredential.user.sendEmailVerification();
      alert("Signup successful! Please verify your email.");
      location.href = "login.html";
    })
    .catch(error => alert(error.message));
}

// Login Function
function login() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      if (!userCredential.user.emailVerified) {
        alert("Please verify your email before logging in.");
        return;
      }
      localStorage.setItem("user", JSON.stringify(userCredential.user));
      location.href = "dashboard.html";
    })
    .catch(error => alert(error.message));
}

// Logout
function logout() {
  auth.signOut().then(() => {
    localStorage.removeItem("user");
    location.href = "login.html";
  });
}

// Reset Password
function resetPassword() {
  const email = document.getElementById("reset-email").value;
  auth.sendPasswordResetEmail(email)
    .then(() => alert("Reset email sent!"))
    .catch(error => alert(error.message));
}

// Add Refund
function addRefund() {
  const orderId = document.getElementById("orderId").value;
  const amount = document.getElementById("amount").value;
  const status = document.getElementById("status").value;
  const user = auth.currentUser;

  if (!user) return alert("You must be logged in.");

  db.collection("refunds").add({
    userId: user.uid,
    orderId,
    amount,
    status,
    createdAt: new Date()
  }).then(() => {
    document.getElementById("orderId").value = '';
    document.getElementById("amount").value = '';
    document.getElementById("status").value = '';
    loadRefunds();
  }).catch(error => {
    console.error("Error adding refund:", error.message);
    alert("Error adding refund: " + error.message);
  });
}

// Load Refunds (Dashboard)
function loadRefunds() {
  const user = auth.currentUser;
  if (!user) return;

  db.collection("refunds")
    .where("userId", "==", user.uid)
    .orderBy("createdAt", "desc")
    .get()
    .then(snapshot => {
      const container = document.getElementById("refund-list");
      container.innerHTML = '';
      snapshot.forEach(doc => {
        const data = doc.data();
        const div = document.createElement("div");
        div.className = "refund-item";
        div.innerHTML = `<strong>Order:</strong> ${data.orderId} |
                         <strong>Amount:</strong> ${data.amount} |
                         <strong>Status:</strong> ${data.status}`;
        container.appendChild(div);
      });
    })
    .catch(error => {
      console.error("Error loading refunds:", error.message);
    });
}

// Auto-redirect to dashboard if already logged in and email verified
auth.onAuthStateChanged(user => {
  if (location.pathname.includes("dashboard")) {
    if (!user || !user.emailVerified) {
      location.href = "login.html";
    }
  }
});
async function exportRefundsToPDF() {
  const user = auth.currentUser;
  if (!user) return alert("You must be logged in.");

  try {
    const snapshot = await db.collection("refunds")
      .where("userId", "==", user.uid)
      .orderBy("createdAt", "desc")
      .get();

    if (snapshot.empty) return alert("No refunds to export.");

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("RefundRadar – Your Refund Report", 10, 15);
    doc.setFontSize(12);

    let y = 30;
    doc.text("Order ID", 10, y);
    doc.text("Amount", 70, y);
    doc.text("Status", 110, y);
    doc.text("Date", 150, y);
    y += 6;

    snapshot.forEach(docSnap => {
      const data = docSnap.data();

      const orderId = String(data.orderId || "N/A");
      const amount = String(data.amount || "N/A");
      const status = String(data.status || "N/A");
      const createdAt = data.createdAt?.toDate?.().toLocaleString?.() || "N/A";

      doc.text(orderId, 10, y);
      doc.text(amount, 70, y);
      doc.text(status, 110, y);
      doc.text(createdAt, 150, y);

      y += 7;
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save("refunds_export.pdf");

  } catch (error) {
    console.error("Error exporting to PDF:", error);
    alert("Export to PDF failed: " + error.message);
  }
}
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");

  const toggleBtn = document.querySelector(".dark-mode-btn");
  if (document.body.classList.contains("dark-mode")) {
    toggleBtn.textContent = "☀️";
  } else {
    toggleBtn.textContent = "🌙";
  }
}
