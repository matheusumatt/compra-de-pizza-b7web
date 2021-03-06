let cart = []
let modalQt = 1
let modalKey

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
        modalKey = key
        
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
function closeModal() { // função para ocultar o modal
    c('.pizzaWindowArea').style.opacity = 0
    setTimeout( ()=>{
        c('.pizzaWindowArea').style.display = 'none'
    }, 500)
}

// adiciona eventos de click e chama a função colseModal nos botões para fechar o modal
cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal)
})
c('.pizzaInfo--qtmais').addEventListener('click', ()=>{ // configuração do botão de aumentar quantidade de pizzas
    modalQt++
    c('.pizzaInfo--qt').innerHTML = modalQt
})

c('.pizzaInfo--qtmenos').addEventListener('click', ()=>{ // configuração do botão de diminuir quantidade de pizzas
    if ( modalQt > 1 ) {
        modalQt--
        c('.pizzaInfo--qt').innerHTML = modalQt
    }
})

// mudando o estilo do tamanho da pizza selecionado
cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click', (e)=>{
        c('.pizzaInfo--size.selected').classList.remove('selected')
        size.classList.add('selected')
        
    })
})

// configura o botão adicionar ao carrinho
c('.pizzaInfo--addButton').addEventListener('click', ()=>{
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'))

    let identifier = pizzaJson[modalKey].id+'@'+size

    let key = cart.findIndex( (item) => item.identifier == identifier )

    if ( key > -1 ) {
        cart[key].qt += modalQt
    } else {
        cart.push({
            identifier,
            id: pizzaJson[modalKey].id,
            size,
            qt: modalQt
        })
    }
    updateCart()
    closeModal()
})

// mostrar o carrinho no mobile
c('.menu-openner').addEventListener('click', () => {
    if ( cart.length > 0 ) {
        c('aside').style.left = '0'
    }
})

// ocultar o carrinho no mobile
c('.menu-closer').addEventListener('click', () => {
    c('aside').style.left = '100vw'
})

function updateCart() {
    c('.menu-openner').innerHTML = cart.length
    if ( cart.length > 0 ) {
        c('aside').classList.add('show')
        c('.cart').innerHTML = ''

        let subtotal = 0
        let desconto = 0
        let total = 0

        for (let i in cart) {
            let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id)
            subtotal += pizzaItem.price * cart[i].qt
            let cartItem = c('.models .cart--item').cloneNode(true)

            let pizzaSizeName

            switch (cart[i].size) {
                case 0: pizzaSizeName = "P"; break
                case 1: pizzaSizeName = "M"; break
                case 2: pizzaSizeName = "G"; break
            }
            
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`

            cartItem.querySelector('img').src = pizzaItem.img
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt

            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if ( cart[i].qt > 1 ) {
                    cart[i].qt--
                } else {
                    cart.splice(i, 1)
                }
                updateCart()
            })

            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qt++
                updateCart()
            })

            c('.cart').append(cartItem)
        }

        desconto = subtotal * 0.1
        total = subtotal - desconto

        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`

    } else {
        c('aside').classList.remove('show')
        c('aside').style.left = '100vw'
    }
}