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

const slides = document.querySelectorAll('.offer__slide'),
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

next.addEventListener('click', () => {
    if (offset == (+width.slice(0, width.length - 2) * (slides.length - 1))) {  //в width храниться 650px, потому сначала работаем как со строкой отрезаем *px* через width.slice(0, width.length - 2), потом превращаем в числовой тип данных, в итоге будет 650*3=1950
        offset = 0; //пограничный вариант самый крайний(правый), возвращаем в начало
    } else {
        offset += +width.slice(0, width.length - 2); //если не последний слайд, то мы добавляем смещение - к offset добавляется ширина еще одного слайда (650) и слайд будет смещаться на определенную величину
    }

    slidesField.style.transform = `translateX(-${offset}px)`; //смещаем поле-обертку, которая содержит все слайды, вправо/влево (если влево то отрицательное, если вправо то положительное значение)

    if (index == slides.length) {
        index = 1;
    } else {
        index +=1
    }
    if (slides.length < 10) {
        current.textContent = `0${index}`;
    } else { 
        current.textContent = index;
    }
})

prev.addEventListener('click', () => {
    if (offset == 0) {// пограничный вариант когда мы на 1 слайде и нажимаем назад - должны переместиться вконец
        offset = (+width.slice(0, width.length - 2) * (slides.length - 1))//из переменной offset отнимаем каждый раз ширину слайда на которую мы смещаемся

    } else {
        offset -= +width.slice(0, width.length - 2); 
    }

    slidesField.style.transform = `translateX(-${offset}px)`;

    
    if (index == 1) {
        index = slides.length;
    } else {
        index -=1
    }
    if (slides.length < 10) {
        current.textContent = `0${index}`;
    } else { 
        current.textContent = index;
    }
})


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