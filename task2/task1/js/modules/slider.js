function slider () { //Slider

    const slider = document.querySelector('.offer__slider'),//получаем слайдер, так нужно установить ему position = 'relative'.
          slides = document.querySelectorAll('.offer__slide'), 
          next = document.querySelector('.offer__slider-next'),  
          prev = document.querySelector('.offer__slider-prev'),
          total = document.querySelector('#total'),
          current = document.querySelector('#current'),
          slidesWrapper = document.querySelector('.offer__slider-wrapper') //главная обертка для слайдов
          slidesField = document.querySelector('.offer__slider-inner')//Обертка-поле с нашими слайдами
          width = window.getComputedStyle(slidesWrapper).width; //window.getComputedStyle(slidesWrapper)тут будет object, a .width => значение *650px*
    let index = 1;
    let offset = 0;//ориентир, чтоб мы четко понимали сколько мы отступили вправо/влево при помощи transform
    
    if (slides.length < 10) {
        total.textContent = `0${slides.length}`;
        current.textContent = `0${index}`;
    } else { 
        total.textContent = slides.length; 
        current.textContent = index;
    }
    
    slidesField.style.width = 100 * slides.length + '%';//устанавливаем для обертки-поля ширину, который будет содержать все слайды (400% от родителя(slidesWrapper) )
    slidesField.style.display = 'flex';//слайды встанут в ряд
    slidesField.style.transition = '1.4s all';
    
    slidesWrapper.style.overflow = 'hidden';//будем видеть только 1 слайд при смещении slidesField
    
    slides.forEach(item => item.style.width = width); //Перебираем слайды и устанавливаем всем одинаковую ширину(переменная width со значением *650px*), чтобы они поместились в поле-обертку slidesField 
    
    slider.style.position = 'relative'//для того чтобы у indicators смогли установить position: absolute;
    
    const indicators = document.createElement('ol'), //будет ol и внутри него li
          dots = []; //создали массив, чтоб в него запушить точки слайдера(внизу смотри)
    indicators.classList.add('carousel-indicators'); //создаем обертку для точек 
    indicators.classList.add('carousel-indicators'); //создаем обертку для точек 
    indicators.style.cssText = ` 
        position: absolute;
        right: 0;
        bottom: 0; 
        left: 0;
        z-index: 15;
        display: flex;
        justify-content: center;
        margin-right: 15%;
        margin-left: 15%;
        list-style: none;
    `; //задаем стили
    slider.append(indicators); //помещаем обертку прямо во внтурь слайдера
    
    for (let i=0; i < slides.length; i +=1) { //иницилиазируем итератор для создания точек для слайда, их будет 4 
        const dot = document.createElement('li');//будет создаватся на каждой итерации
        dot.setAttribute('data-slide-to', i + 1)//устанавливаем аттрибут для каждой точки, который будет говорить первая точка идет первому слайду и так далее, нумерация будет с 1 ( таккак 0+1=1)
        dot.style.cssText = `
            box-sizing: content-box;
            flex: 0 1 auto;
            width: 30px;
            height: 6px;
            margin-right: 3px;
            margin-left: 3px;
            cursor: pointer;
            background-color: #fff;
            background-clip: padding-box;
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;
            opacity: .5; 
            transition: opacity .6s ease;
        `; //opacity: .5 - по умолчанию у всех цвет точек будет блеклым
        if (i==0) {
            dot.style.opacity = 1; //у первой точки будет класс активным 
        }
        indicators.append(dot);//аппендим, выходит вложенность slider/indicators/dot  
        dots.push(dot);//пушим точки слайдера в массив, чтоб потом перебрать через forEach внутри обработчиков событий *next* и *prev*
    }
    
    function deleteNotDigits(str) { //примем строку и удаляем буквы = 500рх будет 500
        return +str.replace(/\D/g, '');
    }
    
    //deleteNot = (str) => +str.replace(/\D/g, '');
    
    next.addEventListener('click', () => {
        if (offset == (deleteNotDigits(width) * (slides.length - 1))) {  //в width храниться 650px, потому сначала работаем как со строкой отрезаем *px* через width.slice(0, width.length - 2), потом превращаем в числовой тип данных, в итоге будет 650*3=1950
             //Analog (+width.slice(0, width.length - 2) * (slides.length - 1)))    
            offset = 0; //пограничный вариант самый крайний(правый), возвращаем в начало
        } else {
            offset += +width.replace(/\D/g, ''); //если не последний слайд, то мы добавляем смещение - к offset добавляется ширина еще одного слайда (650) и слайд будет смещаться на определенную величину, тут будет числовое значение - 650 или 1300 или 1950, которое мы добавим в slidesField.style.transform = `translateX(-${offset}px)`
        }
    
        slidesField.style.transform = `translateX(-${offset}px)`; //смещаем поле-обертку, которая содержит все слайды, вправо/влево (если влево то отрицательное, если вправо то положительное значение)
    
        if (index == slides.length) {//если индекс будет равен количеству слайдов, значит мы дошли до конца слайдера и необходимо перенестись в 1 слайд  index = 1
            index = 1;
        } else {
            index++ //если не дошли до конца, увеличиваем индекс каждый раз на 1 единицу*Примечание указал сначала index +=1 и это выдало ошибку(происходило слияние номера слайда - 02 затем 021 затем 0211 и так далее) потом при переключении с точек слайдера на стрелки слайдера
        }
        if (slides.length < 10) {
            current.textContent = `0${index}`;
        } else { 
            current.textContent = index;
        }
    
        dots.forEach(dot => dot.style.opacity = '.5'); //при клике берем массив и у каждой точки слайдера ставим прозрачность 50%
        dots[index-1].style.opacity = 1;//а другой операцией назначаем активной точке прозрачность 1
    })
    
    prev.addEventListener('click', () => {
        if (offset == 0) {// пограничный вариант когда мы на 1 слайде и нажимаем назад - должны переместиться вконец
            offset = (deleteNotDigits(width) * (slides.length - 1))
    
        } else {
            offset -= deleteNotDigits(width); //из переменной offset отнимаем каждый раз ширину слайда на которую мы смещаемся
        }
    
        slidesField.style.transform = `translateX(-${offset}px)`;
    
        
        if (index == 1) {
            index = slides.length;
        } else {
            index -=1 //стоит ли сделать как и в случаем с index++
        }
        if (slides.length < 10) {
            current.textContent = `0${index}`;
        } else { 
            current.textContent = index;
        }
    
        dots.forEach(dot => dot.style.opacity = '.5');
        dots[index-1].style.opacity = 1;
    })
    
    dots.forEach(dot => {//перебираем и добавляем функциональность, что при клике перемещаться к опред-ному слайду, также нужно учесть offset и current.textContent и index 
        dot.addEventListener('click', (e) => {
            const slideTo = e.target.getAttribute('data-slide-to');//тут атрибут который мы установили ранее каждой точке / тут числовой тип данных (от 1 до 4)
            index = slideTo;
            offset = deleteNotDigits(width) * (index - 1);
    
            slidesField.style.transform = `translateX(-${offset}px)`;
    
            if (slides.length < 10) {
                current.textContent =  `0${index}`;
            } else {
                current.textContent =  index;
            }
    
            dots.forEach(dot => dot.style.opacity = ".5");
            dots[index-1].style.opacity = 1;
        });
    });
    
    
    
    // showSlides(index)
    
    // if (slides.length < 10) {
    //     total.textContent = `0${slides.length}`;
    // } else { 
    //     total.textContent = slides.length;
    // }
    
    // function showSlides(i) {
    //     if (i > slides.length) { //slides.length - 1
    //         index = 1; // 0
    //     }
    //     if (i < 1) {
    //         index = slides.length;  //slides.length - 1
    //     }
        
    //     slides.forEach(slide => slide.style.display = 'none')
    
    //     slides[index-1].style.display = 'block'; // index
    
    //     if (slides.length < 10) {
    //         current.textContent = `0${index}`;
    //     } else { 
    //         current.textContent = index;
    //     }
    // };
    
    // function plusSlider (i) {
    //     showSlides(index += i); //сюда может приходит или +1 или -1, то есть мы или увеличиваем или уменьшаем индекс
    // }
    
    // next.addEventListener('click', () => {
    //     plusSlider (1);
    // })
    
    // prev.addEventListener('click', () => {
    //     plusSlider (-1);
    // })
}

module.exports = slider;