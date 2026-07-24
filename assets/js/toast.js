function formatCurrency(amount) {
  return "₹" + Number(amount).toLocaleString("en-IN") + "/-";
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
}
