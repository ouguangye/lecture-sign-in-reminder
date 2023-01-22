const oVideo = document.querySelector('.video')
let canvas = document.createElement("canvas");
let ctx = canvas.getContext("2d");

async function screenDisplay () {
    oVideo.srcObject = await navigator.mediaDevices.getDisplayMedia({
        video: true
    })
    oVideo.play()
}

screenDisplay()

let num = 300 // 5分钟

let preLoc = ''; // 记录前一次的地址

let init = self.setInterval("tick()", 1000)


// 周期性扫码识别
function tick () {
    // 视频处于准备阶段，并且已经加载足够的数据
    if(oVideo.videoHeight==0) return
    
    // 开始在画布上绘制视频
    canvas.height = oVideo.videoHeight;
    canvas.width = oVideo.videoWidth;
    
    // console.log(canvas, oVideo.videoHeight, oVideo.videoWidth)

    ctx.drawImage(oVideo, 0, 0, canvas.width, canvas.height);
    // getImageData() 复制画布上制定矩形的像素数据
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let code = false;
    try {
        // 识别二维码
        code = jsQR(imageData.data, imageData.width, imageData.height);
    } catch (e) {
        console.error(e);
    }
    // 如果识别出二维码，绘制矩形框
    if (code) {
        // 这里是检测如果码相同，为了防止签到和签退的链接是一样的，所以加了5分钟的限制
        if (preLoc == code.data && n-- >= 0) return
        n = 300
        preLoc = code.data
        alert(code.data)
        if(code.data.includes('https://www.wjx.cn/')){
            alert('问卷星链接')
            window.open(code.data,"_blank"); 
        }
    }
}