function openModal(name, role, photo, desc) {
document.getElementById('modalName').innerText = name;
document.getElementById('modalRole').innerText = role;
document.getElementById('modalPhoto').src = photo;
document.getElementById('modalDesc').innerText = desc;
document.getElementById('modalBg').style.display = 'flex';
}
function closeModal() {
document.getElementById('modalBg').style.display = 'none';
}