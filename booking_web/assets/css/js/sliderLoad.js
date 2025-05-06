document.addEventListener('DOMContentLoaded', function() {
    // Mảng các ảnh cho slider
    const sliderImages = [
        'https://th.bing.com/th/id/R.5d4c6a222a742af27d8608dad5ee272c?rik=Ml6n%2bhNEqjyWrw&pid=ImgRaw&r=0',
        'https://www.dulichyetetphcm.com/wp-content/uploads/2023/07/du-lich-viet-nam-6.jpeg',
        'https://cdn3.ivivu.com/2023/10/du-lich-sai-gon-ivivu2.jpg',
        'https://saigonriders.com/wp-content/uploads/2018/11/can-tho-walking-street-from-a-distant-view-in-the-middle-of-the-night-saigon-riders.png',
        'https://vietnamdiscovery.com/wp-content/uploads/2020/02/Nightlife-in-Nha-Trang.jpg',
        'https://booking.pystravel.vn/uploads/posts/avatar/1684752378.jpg'
    ];
    
    const slider = document.querySelector('.slider');
    let currentImageIndex = 0;
    
    // Tạo hai phần tử background để làm hiệu ứng cross-fade
    function createSliderElements() {
        if (!slider) return;
        
        // Tạo phần tử background chính
        const backgroundElement1 = document.createElement('div');
        backgroundElement1.className = 'slider-background active';
        
        // Tạo phần tử background thứ hai cho hiệu ứng cross-fade
        const backgroundElement2 = document.createElement('div');
        backgroundElement2.className = 'slider-background';
        
        // Tạo phần tử overlay
        const overlayElement = document.createElement('div');
        overlayElement.className = 'slider-overlay';
        
        // Thêm vào DOM
        slider.insertBefore(backgroundElement1, slider.firstChild);
        slider.insertBefore(backgroundElement2, slider.firstChild);
        slider.insertBefore(overlayElement, slider.children[2]);
        
        return [backgroundElement1, backgroundElement2];
    }
    
    // Preload ảnh
    function preloadImages() {
        sliderImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }
    
    // Thiết lập slider ban đầu
    function setupSlider() {
        const backgrounds = createSliderElements();
        if (backgrounds && backgrounds.length === 2) {
            backgrounds[0].style.backgroundImage = `url('${sliderImages[0]}')`;
            backgrounds[1].style.backgroundImage = `url('${sliderImages[1]}')`;
            backgrounds[0].style.opacity = '1';
            backgrounds[1].style.opacity = '0';
        }
    }
    
    // Chuyển đổi giữa các ảnh
    function changeSliderImage() {
        const nextImageIndex = (currentImageIndex + 1) % sliderImages.length;
        const backgrounds = document.querySelectorAll('.slider-background');
        
        if (backgrounds && backgrounds.length === 2) {
            const activeIndex = Array.from(backgrounds).findIndex(bg => 
                bg.classList.contains('active'));
            const inactiveIndex = activeIndex === 0 ? 1 : 0;
            
            // Chuẩn bị background không hoạt động với ảnh mới
            backgrounds[inactiveIndex].style.backgroundImage = `url('${sliderImages[nextImageIndex]}')`;
            
            // Thực hiện crossfade
            backgrounds[activeIndex].classList.remove('active');
            backgrounds[inactiveIndex].classList.add('active');
            
            backgrounds[activeIndex].style.opacity = '0';
            backgrounds[inactiveIndex].style.opacity = '1';
            
            // Cập nhật chỉ số ảnh hiện tại sau khi hoàn thành transition
            currentImageIndex = nextImageIndex;
            
            // Chuẩn bị ảnh tiếp theo sau khi hoàn thành transition
            setTimeout(() => {
                const nextNextIndex = (nextImageIndex + 1) % sliderImages.length;
                backgrounds[activeIndex].style.backgroundImage = `url('${sliderImages[nextNextIndex]}')`;
            }, 1000);
        }
    }
    
    // Khởi tạo
    preloadImages();
    setupSlider();
    
    // Thay đổi ảnh mỗi 5 giây
    setInterval(changeSliderImage, 5000);
});