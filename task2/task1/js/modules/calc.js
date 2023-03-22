function calc () { //Calculator

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
}

export default calc;