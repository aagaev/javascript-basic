//Tabs
const tabs = document.querySelectorAll('.tabheader__item'),
      tabsContent = document.querySelectorAll('.tabcontent'),
      tabsParent = document.querySelector('.tabheader__items');

function hideTabContent () {
    tabsContent.forEach((item) => {
        //item.style.display = 'none';
        item.classList.remove('show', 'fade')
        item.classList.add('hide')
        
     })

     tabs.forEach((item) => {   
        item.classList.remove('tabheader__item_active');
     }); 
}

function showTabContent (i=0) {
   
    //tabsContent[i].style.display = 'block';
    tabsContent[i].classList.remove('hide')
    tabsContent[i].classList.add('show', 'fade')
    tabs[i].classList.add('tabheader__item_active');
}

hideTabContent();
showTabContent ();


tabsParent.addEventListener('click', (event)=> {
    //const target = event.target;
    if (event.target && event.target.classList.contains('tabheader__item')) {
        tabs.forEach((item, i) => {
            if (item == event.target) {  
                hideTabContent();
                showTabContent (i); 
            }
        });
    }
});
//Timer

const deadline = '2023-12-31';

function getTimeRemaining (endtime) {
    const t = Date.parse(endtime) - Date.parse(new Date()), //or new Date()
        days = Math.floor(t / (1000 * 60 * 60 * 24)),
        hours = Math.floor((t / (1000 * 60 * 60) % 24)), // t / 1000 / 60 / 60
        minutes = Math.floor((t / 1000 / 60) % 60),
        seconds = Math.floor((t / 1000) % 60);

    return {
        'total': t,
        'days': days,
        'hours': hours,
        'minutes': minutes,
        'seconds': seconds
    };
}

function getZero (num) {
    if (num >= 0 && num <10) {
        return `0${num}`
    } else {
        return num
    }
}

function setClock(selector, endtime) {
    
    const timer = document.querySelector(selector),
          days = timer.querySelector("#days"),
          hours = timer.querySelector('#hours'),
          minutes = timer.querySelector('#minutes'),
          seconds = timer.querySelector('#seconds'),//?
          
          timeInterval = setInterval(updateClock, 1000);

    
    updateClock();     
    //interval = setInterval(updateClock, 1000) 

    function updateClock() {
        const t = getTimeRemaining(endtime);
 
        days.innerHTML  = getZero(t.days);
        hours.innerHTML = getZero(t.hours);
        minutes.innerHTML = getZero(t.minutes);
        seconds.innerHTML = getZero(t.seconds);
        
        if (t.total <=0) {
            clearInterval(timeInterval);
        }
    }
}


setClock('.timer', deadline);

//Modal window


const modalTrigger  = document.querySelectorAll('[data-modal]'),
      //modalCloseBtn  = document.querySelector('[data-close]'); больше не нужно, так как на новых динамических элементах не будут работать обработчики события, повесим делегирование событий
      modal = document.querySelector('.modal'); 
 function openModal () {
    modal.classList.add('show');
    modal.classList.remove('hide');
    document.body.style.overflow = 'hidden';
    clearInterval(modalTimerId)
    //window.removeEventListener('scroll', showModalByScroll);
 };
      
 function closeModal () {
    modal.classList.add('hide');
    modal.classList.remove('show');
   // modal.classList.remove('hide'); 
    document.body.style.overflow = '';
}
     
modalTrigger.forEach((btn) => {
    btn.addEventListener('click', openModal)
});

//modalCloseBtn.addEventListener('click', closeModal);  на создаваемых динамически новых элементах не будут работать обработчики события, повесим делегирование событий

modal.addEventListener('click', (e) => { 
    if (e.target === modal || e.target.getAttribute('data-close') == '') { // заменили обработчик modalCloseBtn на делегирование событий по атрибуту ('data-close') == '' в modal, будет работать и на новых эелементах        
        closeModal();
    }
});

document.addEventListener('keydown', (e) => {
    if(e.code === 'Escape' && modal.classList.contains('show')) {
        closeModal();
    }
})

const modalTimerId = setTimeout(openModal, 50000); 

function showModalByScroll () {
    if(window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight -1) {
        openModal();
        window.removeEventListener('scroll', showModalByScroll);
    }
}

window.addEventListener('scroll', showModalByScroll);

//Using Class for cardsb

class MenuCard {
    constructor(src, alt, title, descr, price, parentSelector, ...classes) {
        this.src = src;
        this.alt = alt;
        this.title = title;
        this.descr = descr;
        this.price = price;
        this.classes = classes; // тут удет массив
        this.parent = document.querySelector(parentSelector)
        this.transfer = 27;
        this.changeToUAH();
    }
    
    changeToUAH() {
        this.price = this.price * this.transfer;
    }

    render() {
        const element = document.createElement('div');
        if (this.classes.length === 0) {
            this.element = 'menu__item'; //тут пустой массив и мы его перезаписываем, то есть сразу записываем в свойство, у нас будет дефолтный класс
            element.classList.add(this.element);
        } else {
            this.classes.forEach(className => element.classList.add(className));
        };
        
        element.innerHTML = `
            <img src=${this.src} alt=${this.alt}>
            <h3 class="menu__item-subtitle">${this.title}</h3>
            <div class="menu__item-descr">${this.descr}</div>
            <div class="menu__item-divider"></div>
            <div class="menu__item-price"> 
                <div class="menu__item-cost">Цена:</div>
                <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
            </div>
        `;

        this.parent.append(element);
    }
}

const getResource = async (url) => { // function expression Method GET - мы ничего не отправляем на сервер, только получаем, поэтому объекта {method, headers, body} с настройками  не будет!
    const res = await fetch(url)

    if (!res.ok) {// 2 свойства которые есть у промиса, который возвращается из fetch: .ok, status (200, 404, 500 and etc)
       throw new Error(`Could not fetch ${url}, status: ${res.status}`);
    }

    return await res.json(); //промис из fetch обработаем методом json()  и вернем из функции postData  
           // res.json() это тоже промис, мы возвращаем из функции промис
           // Мы делаем запрос, дожидаемся его окончания и трансформируем все эти данные в нормальный джаваскриптовый объект при помощи res.json()
           // и дальше мы его сможем через цепочку .then() обработать как нам надо
};

getResource('http://localhost:3000/menu') //запрос уже ушел и нам нужно его обработать при помощи .then()
    .then((data) =>{ //тут нам с сервера возвращается массив(внутри которого 3 объекта) который можно перебрать
        data.forEach(({img, altimg, title, descr, price}) => { //для удобства каждый элемент массива (объекты) - мы подвергаем деструктуризации(это когда мы из объекта вытаскиваем отдельные свойства(ключ и значение) в качестве отдельной переменной)
            new MenuCard(img, altimg, title, descr, price, '.menu .container').render()
        })
    })

// axios.get('http://localhost:3000/menu') //Библиотека, которая выполняет тоже самое, что мы написали в функции const getResource, и заменяет ее действия, методы, свойства и тд, а такде вызов, 2 в 1.
//         .then((data) =>{ 
//             data.data.forEach(({img, altimg, title, descr, price}) => { 
//                 new MenuCard(img, altimg, title, descr, price, '.menu .container').render()
//             })
//         })

// getResource('http://localhost:3000/menu') // alternative version of - not using Classes
    //     .then(data => createCard(data));

    // function createCard(data) {
    //     data.forEach(({img, altimg, title, descr, price}) => {
    //         const element = document.createElement('div');

    //         element.classList.add("menu__item");

    //         element.innerHTML = `
    //             <img src=${img} alt=${altimg}>
    //             <h3 class="menu__item-subtitle">${title}</h3>
    //             <div class="menu__item-descr">${descr}</div>
    //             <div class="menu__item-divider"></div>
    //             <div class="menu__item-price">
    //                 <div class="menu__item-cost">Цена:</div>
    //                 <div class="menu__item-total"><span>${price}</span> грн/день</div>
    //             </div>
    //         `;
    //         document.querySelector(".menu .container").append(element);
    //     });
    // }

//const div = new MenuCard();
//div.render();
// new MenuCard(  
//     "img/tabs/vegy.jpg",
//     'vegy',
//     'Меню "Фитнес"',
//     'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
//     9,
//     '.menu .container',
// ).render();


//Forms

const forms = document.querySelectorAll('form')

const message = {
    loading: 'img/form/spinner.svg',
    success: 'Thanks. We will contact you soon',
    failure: 'Something wrong'
}

forms.forEach(item => {
    bindPostData(item);
}) //берем нащи формы (form) и под каждую подвязываем функцию postData 

const postData = async (url, data) => { // function expression - Method POST
    const res = await fetch(url, { //res is a promise so we can use .json() and return it
        method: 'POST',
        headers: { 
            'Content-type': 'application/json'
        },
        body: data
    })
    return await res.json(); //промис из fetch обработаем методом json()  и вернем из функции postData  
           // res.json() это тоже промис, мы возвращаем из функции промис
           // и дальше мы его сможем через цепочку .then() обработать как нам надо
}

function bindPostData(form) { //
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        //const statusMessage = document.createElement('div'); 
        //statusMessage.textContent = message.loading; 
        const statusMessage = document.createElement('img');       
        statusMessage.src = message.loading 
        statusMessage.style.cssText = ` 
            display: block; 
            margin: 0 auto; 
        `
        //form.append(statusMessage);  вмещает элемент прямо внутри формы, неудобно если верстка на флексах
        form.insertAdjacentElement('afterend', statusMessage); //более гибкий чем form.append, элемент будет добавляться после формы, удобно при флексах и не сплющивает(сжимает) форму
        
        // const request = new XMLHttpRequest(); заменяем на технологию FETCH
        // request.open('POST', 'server.php');  заменяем на технологию FETCH

        //request.setRequestHeader('Content-type', 'multipart/form-data'); в обычном формате заголовки не нужны когда используем связку XMLHttpRequest и FormData - он установится автоматически
        //request.setRequestHeader('Content-type', 'application/json'); в формате JSON заголовки нужны в таком виде, ныне используется FETCH, смотри выше
       
        // const formData = new FormData(form); //данные которые заполнил пользователь в form&input.value сможем получить в js и отправить на сервер в виде объекта, также есть ключ значение

        // const object = {}; //для того чтобы отправить JSON запрос, создаем пустой объект, в который мы затем при помощи перебора поместим данные которые есть в formData

        // formData.forEach(function(key, value) {
        //     object[key] = value; // на основании данных которые есть в formData мы сформируем объект object при помощи перебора
        // });

        // const json = JSON.stringify(object); //далее обычный объект object превращаем в формат JSON, то есть трансформация new FormData формата в JSON формат 
        
        // fetch('server.php', {
        //     method: 'POST',
        //     headers: { //заголовки нужны когда отправляем JSON формате
        //         'Content-type': 'application/json'
        //     },
        //     body: json //fetch возвращает нам Промис => data, который мы затем обрабатываем в .then()
        // })
        

        const formData = new FormData(form);
        const json = JSON.stringify(Object.fromEntries(formData.entries())); // formData.entries() - берет formData и превращает в массив массивов для того чтоы могли нормально работать с ней.
        //Затем Object.fromEntries(formData.entries()) превращает массив массивов в классический обьект, а затем этот классический обьект превращаем в JSON для отправки на сервер

        postData(' http://localhost:3000/requests', json)
        // .then(data => data.text()) //модифицируем данные чтобы мы могли их получить
        .then(data => { //data это те данные, которые нам возвращаются из Промиса, то есть которые нам вернул сервер
            console.log(data); // request.response === data ** уточнение - с сервера возвращается data но не JSON
            showThanksModal(message.success);
            form.reset(); //очищаем форму
            statusMessage.remove(); //удаляем спиннер
        }).catch(() => {
            showThanksModal(message.failure);
        }).finally(() => {
            form.reset(); //очищаем форму, выполняется всегда независимо как закончился запрос
        })

        //request.send(json);
        // request.send(formData);

        // request.addEventListener('load', () => {
        //     if (request.status === 200) {
        //         console.log(request.response);
        //         showThanksModal(message.success);
        //         form.reset();
        //         statusMessage.remove();
        //     } else {
        //         showThanksModal(message.failure);
        //     }
        // })
    })
}

function showThanksModal(message) {
    const prevModalDialog = document.querySelector('.modal__dialog');

    prevModalDialog.classList.add('hide');
    openModal();

    const thanksModal = document.createElement('div');
    thanksModal.classList.add('modal__dialog');
    thanksModal.innerHTML = `
        <div class="modal__content">
            <div class="modal__close" data-close>×</div>
            <div class="modal__title">${message}</div>
        </div>
    `;
    document.querySelector('.modal').append(thanksModal);
    setTimeout(() => {
        thanksModal.remove();
        prevModalDialog.classList.add('show');
        prevModalDialog.classList.remove('hide');
        closeModal();
    }, 4000);
}

// fetch('http://localhost:3000/menu') //обращаемся к db.json same as (http://localhost:3000/menu) откуда будет возвращаться промис 
//     .then(data => data.json()) //Берем ответ от сервера (data) и превращаем в обычный 
//     .then(res => console.log(res)) // и далее берем тот результат и выводим в консоль


//Slider

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


//Calculator

const result = document.querySelector('.calculating__result span');//куда будет записываться результат

let sex, height, weight, age, ratio;  //будем использовать их в формуле функции ниже

if (localStorage.getItem('sex')) {//дефолтные значения - если в localStorage есть информация то эти значения помещаем в переменные sex или ratio. А если нету - то мы установим ее по умолчанию
    sex = localStorage.getItem('sex')
}   else {
    sex = 'female';
    localStorage.setItem('sex', 'female')
}    

if (localStorage.getItem('ratio')) {//дефолтные значения - если в localStorage есть информация то эти значения помещаем в переменные sex или ratio. А если нету - то мы установим ее по умолчанию
    ratio = localStorage.getItem('ratio')
}   else {
    ratio = 1.375;
    localStorage.setItem('ratio', 1.375);
}  

function initLocalSettings(selector, activeClass) {//функция инициализирует калькулятор, а именно устанавливает классы Активности в нужные нам блоки(1 раз) и больще не будет работать
    const elements = document.querySelectorAll(selector);
    
    elements.forEach(elem => {//перебираем блоки и когда 'id' или'data-ratio' совпадет со значением содержащимся в localStorage то эту элементу(кнопке) мы назначим класс активности
        elem.classList.remove(activeClass);
        if (elem.getAttribute('id') === localStorage.getItem('sex')) {//тут пол муж или жен
            elem.classList.add(activeClass);
        }
        if (elem.getAttribute('data-ratio') === localStorage.getItem('ratio')) { // тут будет число
            elem.classList.add(activeClass);
        }
    })
}

initLocalSettings('#gender div', 'calculating__choose-item_active');
initLocalSettings('.calculating__choose_big div', 'calculating__choose-item_active');
 

function calcTotal () {//общая ф-ция, которая будет заниматься подсчетами с формулой. Будет запускаться каждый раз когда пользователь кликнет или введет что то в input
    if (!sex || !height || !weight || !age || !ratio) {//проверка на false
        result.textContent = '______';
        return;
    }

    if (sex === 'female') {//формула если выбрана female
        result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);//округляем
    } else {//формула если выбрана male
        result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
 
    }
};

calcTotal ()//вызываем сразу, и увидем пустую строчку в '______';

function getStaticInformation(selector, activeClass) {//функция для получения значений с элементов (div) страницы
    // const elements = document.querySelectorAll(`${parentSelector} div`);//получаем элементы внутри родителя, что навесить делегирование на родительский элемент и отслеживать клики - НО В ДАННОМ СЛУЧАЕ ОН НЕ ПРИМЕНИМ, ПОЭТОМУ сразу навещиваем на сами элементы (так как динамически создавать и добавлять Кнопки или Элементы внутрь калькулятора не будем потому и используем навещивание сразу на элементы)  
    const elements = document.querySelectorAll(selector)//update: будем работать без делегирования событий 

    elements.forEach(elem => {     
        elem.addEventListener('click', (e) => {
            if (e.target.getAttribute('data-ratio')) {//условие если есть такой атрибут у объекта события, то мы устанавливаем переменной ratio ее значение и берем вытаскиваем его у e.target.getAttribute('data-ratio') - тут будет число просто
                ratio = +e.target.getAttribute('data-ratio');
                localStorage.setItem('ratio', +e.target.getAttribute('data-ratio'));//записываем в localStorage значение ratio
            } else {//в этом случае работает с полом и получаем уникальный идентификатор (мужчина или женщина)
                sex = e.target.getAttribute('id');//получаем sex - 'female' или'male'
                localStorage.setItem('sex', e.target.getAttribute('id'));//записываем в localStorage значение sex
            }
            console.log(ratio, sex)
    
            elements.forEach(elem => elem.classList.remove(activeClass));//работаем с классами активности, убираем сначала у всех
    
            e.target.classList.add(activeClass);//объекту события(то куда кликнули) назначаем класс Активности
            calcTotal() //должна вызываться каждый раз, когда происходит какое то изменение на странице(ввел, удалил, кликнул - все пересчитывается)
        })
    })

    // document.querySelector(parentSelector).addEventListener('click', (e) => { навесим делегирование на родительский элемент и отслеживать клики
    //     if (e.target.getAttribute('data-ratio')) {
    //         ratio = +e.target.getAttribute('data-ratio');
  
}

getStaticInformation('#gender div', 'calculating__choose-item_active')
getStaticInformation('.calculating__choose_big div', 'calculating__choose-item_active')//добавляем div к селектору, ведь мы обращаемся к блокам внутри селектора

function getDynamicInformation(selector) {//функция для получения значений с элементов (input) страницы
    const input = document.querySelector(selector);//получаем input с которым будем работать

    input.addEventListener('input', () => {//навещиваем обработчик событий, чтоб отслеживать, что пользователь вводит каждый раз и автоматически изменять и запускать calcTotal() с новыми данными
        
        if (input.value.match(/\D/g)) { //если будет введено НЕЧИСЛО
            input.style.border = '1px solid red';// то это ошибка будет красная обводка
        } else {
            input.style.border = 'none'; // bkb ''
        }

        switch(input.getAttribute('id')) {// в input.getAttribute('id') будет одно из значений индентификатора (height, weight и возраст)
            case 'height': ///соответсвенно если будет рост, то значение через +input.value; запишеться в переменную height и так далее.
                height = +input.value;
                break;

            case 'weight': //проверка на строку
                weight = +input.value;
                break;

            case 'age': //проверка на строку
                age = +input.value;
                break;        
        }
        calcTotal() //должна вызываться каждый раз внутри input.addEventListener, когда происходит какое то изменение на странице(ввел, удалил, кликнул - все пересчитывается)
    }); 
    
}  

getDynamicInformation('#height')//передаем три раза сеелктор input
getDynamicInformation('#weight')
getDynamicInformation('#age')