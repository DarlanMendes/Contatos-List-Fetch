//let url='https://633867b7937ea77bfdbf9c86.mockapi.io/pessoa';
let listaContatos;
let favoritos=[]


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
    atualizarContatos();
}
const confereSeLogado = () => {
    let usuarioLogado = localStorage.getItem('usuarioLogado')
    console.log(usuarioLogado)
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
            listaContatos = body
            console.log('dentro', body);
            renderizaContatos()
        })
}
const renderizaContatos =()=>{
    conteudoHtml = '';
    listaContatos.forEach((pessoa, index) => {
        conteudoHtml += `<li class='d-flex flex-column justify-content-between'>
        <h4> ${pessoa.nome} </h4> ${pessoa.telefone}
        <div > 
            <button class='bg-danger rounded text-white' onclick='deletarPessoa(${pessoa.id})'><i class='fa-solid fa-trash' class='botao'></i></button>
            <button class='bg-warning rounded text-white' onclick='favoritarPessoa( ${index} )'><i class='fa-solid fa-star'class='botao'></i></button>
            <button class='bg-primary rounded text-white' onclick='editarPessoa(${index})'><i class='fa-solid fa-pen' class='botao'></i></button>
        </div>
        <hr>
    </li>`
    })
    contatos.innerHTML=conteudoHtml
}

const favoritarPessoa=(linha)=>{
    console.log(linha)
    favoritos.push(listaContatos[linha]);
    console.log(favoritos);
    let listaContatosFiltrado = listaContatos.filter(teste=>teste!==listaContatos[linha]);
    listaContatos = listaContatosFiltrado;
    console.log(listaContatos)
    renderizaContatos()
    rederizaFavoritos()
}
const desfavoritarPessoa=(linha)=>{
    let favoritosFiltrado = favoritos.filter(teste=>teste!==favoritos[linha]);
    listaContatos.push(favoritos[linha])
    favoritos = favoritosFiltrado;
    rederizaFavoritos()
    renderizaContatos()
}
const rederizaFavoritos=()=>{
    favoritosBox.innerHTML =''
    favoritos.forEach((favorito,index)=>{
        favoritosBox.innerHTML +=`<li class='d-flex flex-column justify-content-between'>
        <h4> ${favorito.nome} </h4> ${favorito.telefone}
        <div > 
            <button class='bg-danger rounded text-white' onclick='deletarPessoa(${favorito.id})'><i class='fa-solid fa-trash' class='botao'></i></button>
            <button class='bg-secondary rounded text-white' onclick='desfavoritarPessoa( ${index} )'><i class='fa-solid fa-star'class='botao'></i></button>
            <button class='bg-primary rounded text-white' onclick='editarPessoa(${index})'><i class='fa-solid fa-pen' class='botao'></i></button>
        </div>
        <hr>
    </li>`
    })
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