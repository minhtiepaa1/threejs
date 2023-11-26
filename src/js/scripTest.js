import * as THREE from "three"
import {OrbitControls} from '../../node_modules/three/examples/jsm/controls/OrbitControls.js'
var scene = new THREE.Scene();

// Tạo camera
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);


// Tạo renderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Tạo một hình cầu đơn giản
var geometry = new THREE.SphereGeometry(1, 32, 32);
var material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
var sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);
sphere.name ="sphere1"

// Tạo raycaster để xác định đối tượng được click
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();


// tạo lớp điều khiển quỹ đạo (di chuột để sem các hướng)
// và lấy phần tử dom kết suất làm đối số
const orbit = new OrbitControls(camera, renderer.domElement)

//////////////////////////////////////////// thêm các obj vào bối cảnh 

//// thêm một trình trợ giúp trục và như tên của nó
// chỉ là công cụ đóng vai trò dướng dẫn (hệ tọa độ 3d)
const axesHelper = new THREE.AxesHelper(5);
// thêm nó vào cảnh bằng phương thức add
scene.add(axesHelper)
// đặt máy ảnh lên (vì mặc định 0,0,0 sẽ không nhìn thấy)
// camera.position.z = 5;
// thay đổi trục x, y của máy ảnh để hiện 3 trục
// camera.position.y =2;
// cách nhanh hơn
// camera.position.set(0,2,5)
// thay đổi trường nhìn của camera
camera.position.set(-10, 10, 10)


// mỗi khi thay đổi cần cập nhật vị trí của máy ảnh
orbit.update();

// Xử lý sự kiện click
function onClick(event) {

    // Gọi phương thức update của OrbitControls để cập nhật trạng thái
    orbit.update();
    
    // Chuyển đổi tọa độ chuột sang hệ tọa độ chuẩn
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Cập nhật raycaster
    raycaster.setFromCamera(mouse, camera);

    // Kiểm tra các đối tượng gặp phải bởi tia
    var intersects = raycaster.intersectObjects(scene.children);

    // Nếu có đối tượng được click, thực hiện hành động mong muốn
    if (intersects.length > 0 ) {
        var clickedObject = intersects[0].object;
        console.log("Đã click vào đối tượng:", clickedObject);
        if (clickedObject.name !== "sphere1") {
            return;
        }
        // Thực hiện hành động mong muốn với đối tượng được click
        // Ví dụ: thay đổi màu sắc của đối tượng
        clickedObject.material.color.set(0x00ff00);
        // Hiển thị popup
        document.getElementById("popup").style.display = "block";
    }
}

// hover pointer
var hoveredObject = null;

function onMouseMove(event) {
    // Chuyển đổi tọa độ chuột sang hệ tọa độ chuẩn
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Cập nhật raycaster
    raycaster.setFromCamera(mouse, camera);

    // Kiểm tra các đối tượng gặp phải bởi tia
    var intersects = raycaster.intersectObjects(scene.children);

    // Nếu có đối tượng, thay đổi kiểu chuột và lưu trữ đối tượng được hover
    if (intersects.length > 0) {
        if (hoveredObject !== intersects[0].object) {
            if (hoveredObject) {
                // Nếu có đối tượng trước đó, reset kiểu chuột
                document.body.style.cursor = 'default'; // hoặc bất kỳ kiểu chuột mặc định nào bạn muốn
            }
            hoveredObject = intersects[0].object;
            document.body.style.cursor = 'pointer'; // hoặc bất kỳ kiểu chuột nào bạn muốn khi trỏ vào đối tượng
            
            if (hoveredObject.name !== "sphere1") {
                return;
            }
            document.getElementById("popup").style.display = "block";
        }
    } else {
        // Nếu không có đối tượng, reset kiểu chuột và lưu trữ là không có đối tượng được hover
        document.body.style.cursor = 'default';
        hoveredObject = null;
        document.getElementById("popup").style.display = "none";
    }
}

// Gán sự kiện click cho cửa sổ
window.addEventListener('click', onClick);
window.addEventListener('mousemove', onMouseMove);

//
// Sự kiện click cho nút đóng popup
document.getElementById("closeBtn").addEventListener('click', function() {
    // Ẩn popup khi nút đóng được click
    document.getElementById("popup").style.display = "none";
});

// Render loop
function animate() {
    orbit.update();
    requestAnimationFrame(animate);
// console.log("hello ")
    // Xoay hình cầu
    sphere.rotation.x += 0.01;
    sphere.rotation.y += 0.01;

    // Render scene
    renderer.render(scene, camera);
}

// Bắt đầu render loop
animate();
