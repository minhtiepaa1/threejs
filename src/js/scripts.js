import * as THREE from "three"
// module điều khiển quỹ đạo để di chuyển xem các góc (phóng to thu nhỏ, xem các hướng)
import {OrbitControls} from '../../node_modules/three/examples/jsm/controls/OrbitControls.js'
import * as dat from "dat.gui"

import wormhole from '../../static/wormhole.png'
import earth from '../../static/earth.jpg'
//////////////////////////////////////// phần khởi tạo

// trình kết xuất như một công cụ mà 3js sử dụng để phân bổ khoảng trống trên
// trang web nơi mà chúng ta có thể thêm và tạo ảnh cho tất cả các nội dung 3d
// mà chúng ta sẽ tạo sau
const renderer = new THREE.WebGLRenderer()


// enable bóng của trình kết suất
renderer.shadowMap.enabled = true;

// gọi phương thức kích thước đã đặt
// truyền đối số vào đây muốn chiếm không gian đps trên toàn bộ trang bằng cách sử dụng
// các thuộc tính chiều rộng và chiều cao bên trong window
renderer.setSize(window.innerWidth, window.innerHeight)

// tạo body là một phần tử canvas vào trang
document.body.appendChild(renderer.domElement)

// tạo một lớp máy ảnh phối cảnh
const scene = new THREE.Scene(); // scene có nghĩa là bối cảng 

// truyền vào 4 đối số trên dưới trái phải
// chieu rong chia chieu cao
// cách mặt phẳng cắt gần xa 0.1, 1000
// liên kết cảnh với máy ảnh bằng trình kết suất
// đặt trong máy ảnh các phiên bản làm đối số
const camera = new THREE.PerspectiveCamera(
75, 
window.innerWidth / window.innerHeight,
0.1,
1000
)

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
camera.position.set(-10, 30, 30)


// mỗi khi thay đổi cần cập nhật vị trí của máy ảnh
orbit.update();

// tạo một cái hộp 
const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial({color:0x00ff00});
const box = new THREE.Mesh(boxGeometry, boxMaterial)
scene.add(box)


// tạo một mặt phẳng (truyền chiều rộng và chiều cao vào)
const planeGeometry = new THREE.PlaneGeometry(30, 30)
// tạo một vật liệu hợp nhất nó với hình học thành một lưới
// sau đó thêm nó vào cảnh
// khi xem mặt dưới mặt phẳng sẽ mất đi nếu không muốn nó mất đi thêm 
// vào dối số side
const planMaterial = new THREE.MeshStandardMaterial({
    color:0xFFFFFF,
    side:THREE.DoubleSide
})
const plane = new THREE.Mesh(planeGeometry, planMaterial)
scene.add(plane)
// làm cho mặt phằng trùng khớp với lưới (cần phải xoay nó)
plane.rotation.x = -0.5 * Math.PI;
// đối tượng nhận hoặc tạo bóng thì mặt phẳng ở đây sẽ nhận được bóng do 
// quả cầu phát ra ở phí trước nguồn sáng 
// quả cầu sẽ tạo bóng bằng cách ở phái trước về nguồn sáng 
plane.receiveShadow = true;

// thêm trình trợ giúp lưới cho mặt phẳng(truyền vào kích thước, chi nhỏ ô vuông )
const gridHelper = new THREE.GridHelper(30);
scene.add(gridHelper);

// thêm một hình cầu vào trong bối cảnh 
// tạo một thể hiện của lớp hình học hình cầu (bán kính đối số (radius), chiều rộng, chiều cao)
const sphereGeometry = new THREE.SphereGeometry(4, 50, 50)
// để hiển thị bộ khung của quá cầu truyền vào thuộc tính wireFrame
// nếu dùng MeshStandardMaterial quả cầu sẽ có hình đen vì kho có ánh sáng
// lưu ý đọc thêm tài liệu để biết thêm nhiều 
// basic vật liêu khổng bị ảnh dưởng bởi ánh sáng
// standard vật liệu bị ảnh hưởng bởi ánh sáng
const sphereMaterial = new THREE.MeshStandardMaterial({
    color:0x0000FF,
    wireframe: false,
})
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial) // sphere (quả cầu)
scene.add(sphere)

sphere.position.set(-10,10,0)
// quả cầu sẽ tạo bóng bằng cách ở phái trước về nguồn sáng 
sphere.castShadow = true;
///////////////////////////////////////////// dat.gui chỉnh màu cho obj


/////////////////////////// thêm ánh sáng
// thêm  ánh sáng xum quanh, chúng ta chỉ cần tạo một thể hiện của lớp ánh
// sáng xum quanh, màu của ánh sáng làm đổi số 
const ambientLight = new THREE.AmbientLight(0x333333,5)

// không thấy gì thay đổi vì đang sử dụng vật liệu nền không ảnh hưởng bởi ánh sáng
scene.add(ambientLight)
////////////// để thêm ánh sáng định hướng cần tạo một phiên bản của lớp ánh sáng
// dối số (màu sắc, cường độ ánh sáng)

// thêm ánh sáng định hướng
const directionalLight = new THREE.DirectionalLight(0xFFFFFF,0.8);
// scene.add(directionalLight)
// thay đổi hướng của ánh sáng 
directionalLight.position.set(-20,50, 0 )
// ánh sáng định hướng tạo ra bóng tối, đó là điểm gãy chính trong quá trình tạo bóng
// directionalLight.castShadow = true;

// để tăng kích thước của bề mặt đó chúng ta cần di chuyển các phân đoạn của camera
// cập nhật vị trí các mặt của camera
// directionalLight.shadow.camera.bottom = -12

// thêm trình trợ giúp ánh sáng 
// đó là một hình vuông biểu thị hướng của ánh sáng(đối số thứ 2 kích thước của hình vuông)
const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5)

// scene.add(dLightHelper)


// trình trợ giúp ánh sáng bóng đổ
const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
// scene.add(dLightShadowHelper)

// ánh sáng loại 3 dạng đèn sân khấu
// đưa dạng vật liều trở về basic
const spotLight = new THREE.SpotLight(0xFFFFFF,1000);
scene.add(spotLight);
spotLight.position.set(-50,50,0);
spotLight.castShadow =true;
// // bóng đổ bị mờ thêm angle vào
spotLight.angle =0.2;

const slightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(slightHelper);

// thêm hiệu ứng sưa mù khi phóng to thu nhỏ 
// scene.fog = new THREE.Fog(0xFFFFFF, 0, 200)
// cách 2 thêm sương mù (tăng theo cấp số nhân theo khoảng cách từ máy ảnh)
scene.fog = new THREE.FogExp2(0xFFFFFF,0.01)
/////////////////////////// hoàn tất việc thêm ánh sáng
// thêm bóng, threejs không được bật theo mặc định nên cần enable bản đồ bóng của
// trình kết suất === true

// thay nền đen bằng màu khác
// renderer.setClearColor(0xABCDEF);
// sử dung trình tải kết cấu để tải một hình ảnh và sau đó đặt nó làm nền
const textureLoader = new THREE.TextureLoader();
scene.background = textureLoader.load(wormhole);

// sử dụng trình tải kết cấu khối để tạo ảnh 6 hướng 
// nhưng không tải được có về không load được
// const cubeTextureLoader = new THREE.CubeTextureLoader();
// scene.background = cubeTextureLoader.load([
//     wormhole,
//     earth,
//     wormhole,
//     earth,
//     earth,
//     earth,
// ])

// tạo một khối khác và thay ảnh cho khối đó

const box2Geometry = new THREE.BoxGeometry(10,10,10);
const box2Material = new THREE.MeshBasicMaterial({
    // color:0x00FF00,
    map:textureLoader.load(earth)

})
const box2 = new THREE.Mesh(box2Geometry, box2Material);
scene.add(box2);
box2.position.set(0, 15, 10);

const gui = new dat.GUI();

// tạo đối tượng giữ màu cho các tành phần giao diện

const options = {
     sphereColor:"#ffea00",
     wireframe:false,
     speed:0.01,
     // điểu chỉnh bóng đổ cho quả bóng
     angle:0.2,
     penumbra:0,
     intensity:1,

}
// thêm bảng màu, gọi phương thức thêm màu với đối tượng tùy chọn
// được đặt làm đối số đầu tiên và khóa của phần tử làm đối số thứ 2 (đẩm bảo là string)
// tạo phương thức onchange và truyền vào một callback function để làm mỗi khi thay đổi
gui.addColor(options, "sphereColor").onChange(function(e){

    // trên giao diện chúng ta muốn thay đổi màu của hình cầu
    sphere.material.color.set(e)
})

// thay đổi hình cầu dạng lưới hoặc không

gui.add(options, "wireframe").onChange((e)=>{
    // 
    sphere.material.wireframe = e;
})

// muốn làm cho quả cầu nảy lên và kiểm soát tốc độ nảy (0, 0.1) là min, max
gui.add(options, "speed", 0, 0.1)

// điều chỉnh bóng đổ với ánh sáng loại đèn sân khấu
gui.add(options, "angle", 0, 1)
gui.add(options, "penumbra", 0, 1)
gui.add(options, "intensity", 0, 1000)

////////////////////////////////////////////// phần tạo các hàm

// render không vòng lặp thì dùng cái này (render thường)
// biến đổi hình học cho box 
// box.rotation.x = 5;
// box.rotation.y = 5;

// thêm hình cẩu nhảy lên xuống
let step = 0;


// tự động xoay cho box, vòng lặp chạy liên tục
function animate(time){
    //time giá trị xoay
    // console.log("time:", time)
    box.rotation.x = time /1000;
    box.rotation.y = time /1000;

    step += options.speed;
   let step1 = 10 * Math.abs(Math.sin(step))
//    console.log("step1:", step1)
    sphere.position.y = 10 * Math.abs(Math.cos(step))

    // cunstom độ bóng đổ ánh sáng đèn sân khấu
    // dộ rộng của đèn
    spotLight.angle = options.angle;
    //làm mờ lũy tiến vào cạnh của ảnh
    spotLight.penumbra = options.penumbra;
    // cường độ ánh sáng
    spotLight.intensity = options.intensity;
    //cập nhật trình trợ giúp mỗi khi thay đổi giá trị
    slightHelper.update()

    renderer.render(scene, camera)
}

////////////////////////////////////////////////// phần call render
console.log("animate", box, "x", window.innerWidth, "y", window.innerHeight," render:",renderer)
//  render thường
// renderer.render(scene, camera)
renderer.setAnimationLoop(animate)

// note 
/*
việc tạo một phần tử trong 3js diễn ra ở 3 gian đoạn

1, tạo hình học khung hình dạng 3d mà chúng ta muốn
2, tạo vật liệu (lớp phủ của hình dạng) có một số vật liệu có sẵn để sử dụng
3, bao quát hình học bằng vật liệu 

// việc sử lý các giá trị để có được vị trí hoàn hảo của một phần tử 
hoặc màu sắc của nó chẳng hạn mất nhiều thời gian,
có một giải pháp là chỉ sử dụng giao diện có kích thước nhỏ cho mục đích đó
có thể tạo ra giải pháp đó theo cách thủ công nhưng đã có thu viện hỗ trợ
tên là: đa.gui: npm install dat.gui
// 
*/
