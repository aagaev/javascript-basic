function cards() { 
    //Using Class for cards

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
}

module.exports = cards;