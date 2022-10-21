//let url='https://633867b7937ea77bfdbf9c86.mockapi.io/pessoa';
let listaContatos;



let url = 'https://634ab69d33bb42dca4099305.mockapi.io/contact'

const fazerLogin = () => {
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
const addContact = async () => {
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
            let conteudoHtml = '';
            body.forEach((pessoa, index) => {
                conteudoHtml += "<li class='d-flex justify-content-between'>" + `${index + 1}` + ". <h4>" + pessoa.nome + " </h4>  " + pessoa.telefone + "<div> <button class='bg-danger rounded text-white' onclick='deletarPessoa(" + pessoa.id + ")'><i class='fa-solid fa-trash'></i></button> <button class='bg-primary rounded text-white' onclick='editarPessoa(" + index + ")'><i class='fa-solid fa-pen'></i></button></div></li>"
            })
            contatos.innerHTML = conteudoHtml;
        })
}
const editarPessoa = (linha) => {
    atualizacaoCard.style = "display:flex!important"
    atualizacaoCard.innerHTML ="<div class='d-flex position-fixed bg-white mt-5 h-25 p-5 border-dark'><div><input id='novoNome' placeholder='Novo Contato' value='" + listaContatos[linha].nome + "' class='rounded mb-1' type='text' /> <input id='novoTelefone' placeholder='Novo Telefone' value='" + listaContatos[linha].telefone + "'class='rounded mb-1'type='text'/></div><div class='d-flex align-items-center justify-content-center'><button class='bg-success rounded m-2' onclick='atualizarPessoa(" + listaContatos[linha].id + ")'><i class='fa-solid fa-upload text-white'></i></button><button class='bg-danger rounded' onclick='cancelarCard()'><i class='fa-solid fa-xmark text-white'></i></button></div></div>"
   
}
const cancelarCard = () => {
    atualizacaoCard.style = "display:none!important";
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
    console.log('id pessoa', id_pessoa)
    let atualizado = await fetch(url + "/" + id_pessoa,
        {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome: novoNome.value, telefone: novoTelefone.value
            })
        }

    )
    atualizacaoCard.style = "display:none";
    contatos.innerHTML = 'Atualizando...'
    console.log(atualizado);

    await atualizarContatos();


}

document.getElementById("form").addEventListener("click", (event) => {
    event.preventDefault()
}); 