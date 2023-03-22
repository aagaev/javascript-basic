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
};

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

// async function getResource(url) {
//     let res = await fetch(url);

//     if (!res.ok) {
//         throw new Error(`Could not fetch ${url}, status: ${res.status}`);
//     }

//     return await res.json();
// }


export {postData};
export {getResource};