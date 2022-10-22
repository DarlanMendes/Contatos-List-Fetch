//let url='https://633867b7937ea77bfdbf9c86.mockapi.io/pessoa';
let listaContatos;
let favoritos;
let listaContatosFiltrado;
//  if(localStorage.getItem('listaContatos')){
//      listaContatosFiltrado=JSON.parse(localStorage.getItem('listaContatos'));
//  }
if (localStorage.getItem('favoritos')) {
    favoritos = JSON.parse(localStorage.getItem('favoritos'));
    console.log(favoritos)
}

let url = 'https://634ab69d33bb42dca4099305.mockapi.io/contact'
atualizacaoCard.style = "display:none!important";
function fazerLogin() {
    if (email.value && senha.value) {
        console.log('teste')
        if (email.value === 'login' && senha.value === 'senha') {
            localStorage.setItem('usuarioLogado', true);
            window.location = 'index.html'
        } else {
            avisoLogin.innerHTML = 'Credenciais inválidas, por favor, insira novamente suas credenciais'
        }
    } else {
        avisoLogin.innerHTML = 'Por favor, insira todos os campos';
        console.log('teste')
    }

}
const logout = () => {
    localStorage.setItem('usuarioLogado', false);
    localStorage.removeItem('listaContatos');
    localStorage.removeItem('favoritos');
    window.location = 'login.html';
}
const addContact = async () => {
    atualizacaoCard.style = "display:flex";
    atualizacaoCard.innerHTML = '<h3>Salvando contato...</h3>';
    telaListaContatos.style = "opacity:75%!important"
    let resultado = await fetch(url,
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome: nome.value, telefone: telefone.value })
        }

    );
    telaListaContatos.style = "opacity:100%!important"
    atualizacaoCard.style = "display:none!important";
    nome.value = '';
    telefone.value = '';
    console.log(resultado.statusText);
    localStorage.removeItem('listaContatos');
    atualizarContatos();
}
const confereSeLogado = () => {
    let usuarioLogado = localStorage.getItem('usuarioLogado')
    if (!usuarioLogado) {
        window.location = "login.html"
    }
}

const atualizarContatos = () => {
    confereSeLogado()
    contatos.innerHTML = 'Atualizando contatos...'
    fetch(url).
        then(resposta => resposta.json()).
        then(body => {
            listaContatos = body;
            renderizaContatos();
            rederizaFavoritos()
        })
}
const renderizaContatos = () => {
    conteudoHtml = '';
    if (favoritos) {

        listaContatos.forEach((contato, index) => {
                console.log(contato.id)
                if (favoritos[index] !== Number(contato.id)) {
                    conteudoHtml += `<li class='d-flex flex-column justify-content-between'>
                    <h4> ${contato.nome} </h4> ${contato.telefone}
                    <div > 
                        <button class='bg-danger rounded text-white' onclick='deletarPessoa(${contato.id})'><i class='fa-solid fa-trash' class='botao'></i></button>
                        <button class='bg-warning rounded text-white' onclick='favoritarPessoa( ${contato.id} )'><i class='fa-solid fa-star'class='botao'></i></button>
                        <button class='bg-primary rounded text-white' onclick='editarPessoa(${index})'><i class='fa-solid fa-pen' class='botao'></i></button>
                    </div>
                    <hr>
                </li>`
                }
        })
    }else{
        listaContatos.forEach((pessoa, index) => {
                conteudoHtml += `<li class='d-flex flex-column justify-content-between'>
                        <h4> ${pessoa.nome} </h4> ${pessoa.telefone}
                        <div > 
                            <button class='bg-danger rounded text-white' onclick='deletarPessoa(${pessoa.id})'><i class='fa-solid fa-trash' class='botao'></i></button>
                            <button class='bg-warning rounded text-white' onclick='favoritarPessoa( ${pessoa.id} )'><i class='fa-solid fa-star'class='botao'></i></button>
                            <button class='bg-primary rounded text-white' onclick='editarPessoa(${index})'><i class='fa-solid fa-pen' class='botao'></i></button>
                        </div>
                        <hr>
                    </li>`
            })
    }



    contatos.innerHTML = conteudoHtml
}

const favoritarPessoa = (indice) => {
    if(!favoritos){
        favoritos=[]
    }
    favoritos.push(indice);
    let favoritosStorage = JSON.stringify(favoritos)
    console.log(favoritos);
    localStorage.setItem('favoritos', favoritosStorage)
    filtrarListaContatos(indice)
    renderizaContatos()
    rederizaFavoritos()
}
const filtrarListaContatos=(indice)=>{
    listaContatosFiltrado = listaContatos.filter(contato => contato.id !== indice); 
}
const desfavoritarPessoa = (indice) => {
    let favoritosFiltrado = favoritos.filter(teste => teste!==Number(indice) );
    favoritos = favoritosFiltrado;
     armazenaFavoritoStorage()
     rederizaFavoritos()
     renderizaContatos()
}
const armazenaFavoritoStorage = () => {
    let favoritosStorage = JSON.stringify(favoritos)
    localStorage.setItem('favoritos', favoritosStorage);
}
const rederizaFavoritos = () => {
    if (favoritos) {
        favoritosBox.innerHTML = ''
        listaContatos.forEach((contato, index) => {
            favoritos.forEach((indice) => {
                console.log(indice === Number(contato.id));
                if (indice === Number(contato.id)) {
                    favoritosBox.innerHTML += `<li class='d-flex flex-column justify-content-between'>
            <h4> ${contato.nome} </h4> ${contato.telefone}
            <div > 
                <button class='bg-danger rounded text-white' onclick='deletarPessoa(${contato.id})'><i class='fa-solid fa-trash' class='botao'></i></button>
                <button class='bg-secondary rounded text-white' onclick='desfavoritarPessoa( ${contato.id} )'><i class='fa-solid fa-star'class='botao'></i></button>
                <button class='bg-primary rounded text-white' onclick='editarPessoa(${index})'><i class='fa-solid fa-pen' class='botao'></i></button>
            </div>
            <hr>
        </li>`
                }
            })
        })
    }

}
const editarPessoa = (linha) => {
    telaListaContatos.style = "opacity:50%!important"
    atualizacaoCard.style = "display:flex!important"
    atualizacaoCard.innerHTML = "<div id= 'cardEdicao' class='d-flex flex-column position-fixed align-items-center justify-content-center rounded opacity-100 zindex-6 bg-white mt-5 h-25 p-5 border-dark'><h4>Edite seu contato:</h4><div class='d-flex flex-column justify-content-center'><input id='novoNome' placeholder='Novo Contato' value='" + listaContatos[linha].nome + "' class='rounded mb-1' type='text' /> <input id='novoTelefone' placeholder='Novo Telefone' value='" + listaContatos[linha].telefone + "'class='rounded mb-1'type='text'/></div><div class='d-flex align-items-center justify-content-center'><button class='bg-success rounded m-2' onclick='atualizarPessoa(" + listaContatos[linha].id + ")'>Salvar<i class='fa-solid fa-upload text-white'></i></button><button class='bg-danger rounded' onclick='cancelarCard()'>Cancelar<i class='fa-solid fa-xmark text-white'></i></button></div></div>"

}
const cancelarCard = () => {
    atualizacaoCard.style = "display:none!important";
    telaListaContatos.style = "opacity:100%!important"
}

const deletarPessoa = async (id_pessoa) => {
    let contatoDeletado = await fetch(url + "/" + id_pessoa,
        {
            method: 'DELETE'
        }

    )
    console.log(id_pessoa, contatoDeletado);
    atualizarContatos();
}
const atualizarPessoa = async (id_pessoa) => {
    let nome = novoNome;
    let telefone = novoTelefone;
    console.log(nome, telefone)
    atualizacaoCard.innerHTML = '<h3>Salvando contato...</h3>';
    console.log('id pessoa', id_pessoa)
    let atualizado = await fetch(url + "/" + id_pessoa,
        {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome: nome.value, telefone: telefone.value
            })
        }

    )

    console.log("Deu certo")
    atualizacaoCard.style = "display:none!important";
    telaListaContatos.style = "opacity:100%!important"
    contatos.innerHTML = 'Atualizando...'
    console.log(atualizado);

    await atualizarContatos();


}

document.getElementById("form").addEventListener("click", (event) => {
    event.preventDefault()
}); 