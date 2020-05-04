let modalQt = 1

const c = (el) => document.querySelector(el) // função auxiliar para 'pegar' elementos com querySelector()
const cs = (el) => document.querySelectorAll(el) // função auxiliar para 'pegar' elementos com querySelectorAll()

pizzaJson.map((item, index)=>{ // mapeando o json
    let pizzaItem = c('.models .pizza-item').cloneNode(true) // clona o a div.models e seus filhos para cada item do json

    pizzaItem.setAttribute('data-key', index) // adiciona um atributo na div com o valor (do atributo) do índice da pizza que está sendo exibida na div
    
    // adiciona as informações das pizzas
    pizzaItem.querySelector('.pizza-item--img img').src = item.img // altera o atributo src da img
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}` // adiciona o preço
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name // adiciona o nome
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description // adiciona a descrição

    pizzaItem.querySelector('a').addEventListener('click', (e)=>{ // adiciona um evento de click na tag a
        e.preventDefault() // altera o comportamento padrão de click no link (tag a)

        let key = e.target.closest('.pizza-item').getAttribute('data-key')
        modalQt = 1
        
        c('.pizzaBig img').src = pizzaJson[key].img
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`

        c('.pizzaInfo--size.selected').classList.remove('selected')
        cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{

            if ( sizeIndex == 2 ) {
                size.classList.add('selected')
            }

            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex]
        })

        c('.pizzaInfo--qt').innerHTML = modalQt

        // exibe o modal
        c('.pizzaWindowArea').style.opacity = 0 // utilizado para dar um efeito ao mostrar o modal
        c('.pizzaWindowArea').style.display = 'flex' // altera o display da div.pizzaWindowArea para exibir o modal
        setTimeout(()=>{ // utilizado para dar um efeito ao mostrar o modal
            c('.pizzaWindowArea').style.opacity = 1 // utilizado para dar um efeito ao mostrar o modal
        }, 200)
    
    })

    c('.pizza-area').append( pizzaItem )
})

// Eventos do modal
function closeModal() {
    c('.pizzaWindowArea').style.opacity = 0
    setTimeout( ()=>{
        c('.pizzaWindowArea').style.display = 'none'
    }, 500)
}

cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal)
})