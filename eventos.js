//let url='https://633867b7937ea77bfdbf9c86.mockapi.io/pessoa';
let listaContatos;
let favoritos;
let listaContatosFiltrado = [];
let ordemCrescente;

if (localStorage.getItem('listaContatos')) {
    listaContatos = JSON.parse(localStorage.getItem('listaContatos'));
}
if (localStorage.getItem('favoritos')) {
    favoritos = JSON.parse(localStorage.getItem('favoritos'));
} else {
    favoritos = []
}
if (localStorage.getItem('listaContatosFiltrado')) {
    listaContatosFiltrado = JSON.parse(localStorage.getItem('listaContatosFiltrado'));
} else {
    listaContatosFiltrado = []
}
if (localStorage.getItem('ordemCrescente')) {
    ordemCrescente = JSON.parse(localStorage.getItem('ordemCrescente'))
} else {
    ordemCrescente = true;
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
            organizaLista()
            localStorage.setItem('listaContatos', JSON.stringify(listaContatos))
            if (listaContatos !== JSON.parse(localStorage.getItem('listaContatos'))) {
                console.log('entrou')
                listaContatosFiltrado = listaContatos

            } else {
                listaContatosFiltrado = JSON.parse(localStorage.getItem('listaContatosFavorito'))
            }
            if (!listaContatosFiltrado) {
                listaContatosFiltrado = listaContatos

            }

            filtrarListaContatos();
            renderizaContatos();
            rederizaFavoritos()
        })
}
const organizaLista = () => {
    if (ordemCrescente) {
        listaContatos.sort((a, b) => {
            if (a.nome > b.nome) {
                return 1
            } else if (a.nome < b.nome) {
                return -1
            } else {
                return 0
            }

        })
    } else {
        listaContatos.sort((b, a) => {
            if (a.nome > b.nome) {
                return 1
            } else if (a.nome < b.nome) {
                return -1
            } else {
                return 0
            }

        })
    }
}

const renderizaContatos = () => {
    listaContatosFiltrado = JSON.parse(localStorage.getItem('listaContatosFiltrado'))
    conteudoHtml = '';
    listaContatosFiltrado.forEach((contato, index) => {

        conteudoHtml += `<li class='d-flex flex-column justify-content-between'>
                    <h4> ${contato.nome} </h4> ${contato.telefone}
                    <div > 
                        <button class='bg-danger rounded text-white' onclick='deletarPessoa(${contato.id})'><i class='fa-solid fa-trash' class='botao'></i></button>
                        <button class='bg-warning rounded text-white' onclick='favoritarPessoa(${index} )'><i class='fa-solid fa-star'class='botao'></i></button>
                        <button class='bg-primary rounded text-white' onclick='editarPessoaContato(${contato.id},"contato")'><i class='fa-solid fa-pen' class='botao'></i></button>
                    </div>
                    <hr>
                </li>`
    })
    contatos.innerHTML = conteudoHtml
}
function rederizaFavoritos() {
    favoritos = JSON.parse(localStorage.getItem('favoritos'))
    favoritosBox.innerHTML = ''
    if (favoritos) {
        favoritos.forEach((contato, index) => {

            favoritosBox.innerHTML += `<li class='d-flex flex-column justify-content-between'>
            <h4> ${contato.nome} </h4> ${contato.telefone}
            <div > 
                <button class='bg-danger rounded text-white' onclick='deletarPessoa(${contato.id})'><i class='fa-solid fa-trash' class='botao'></i></button>
                <button class='bg-seconndary rounded text-white' onclick='desfavoritarPessoa(${index} )'><i class='fa-solid fa-star'class='botao'></i></button>
                <button class='bg-primary rounded text-white' onclick='editarPessoaContato(${contato.id},"favorito")'><i class='fa-solid fa-pen' class='botao'></i></button>
            </div>
            <hr>
        </li>`



        })
    }
}

const favoritarPessoa = (indice) => {
    let contato = listaContatosFiltrado[indice]
    if (favoritos === null) {
        favoritos = []
    }
    favoritos.push(contato)
    localStorage.setItem('favoritos', JSON.stringify(favoritos))
    filtrarListaContatos()
    renderizaContatos()
    rederizaFavoritos()
}
const filtrarListaContatos = () => {
    if (favoritos && favoritos.length > 0) {
        console.log('fav', favoritos)
        favoritos.forEach((favorito) => {

            listaContatosFiltrado = listaContatosFiltrado.filter(contato => contato.id !== favorito.id)

        })
    } else {
        listaContatosFiltrado = listaContatos;
    }
    localStorage.setItem('listaContatosFiltrado', JSON.stringify(listaContatosFiltrado));
}


const desfavoritarPessoa = (indice) => {
    listaContatosFiltrado.push(favoritos[indice])
    localStorage.setItem('listaContatosFiltrado', JSON.stringify(listaContatosFiltrado));
    favoritos.splice(indice, 1)
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
    filtrarListaContatos()
    rederizaFavoritos()
    renderizaContatos()
}
const ordenar = () => {
    ordemCrescente = !ordemCrescente;
    localStorage.setItem('ordemCrescente', JSON.stringify(ordemCrescente));
    organizaLista();
    atualizarContatos()
}
const atualizarPessoa = async (id_pessoa) => {
    let nome = novoNome;
    let telefone = novoTelefone;
    if (favoritos) {
        let favoritoAtualizado = favoritos.find(o => Number(o.id) === id_pessoa)
        let indexFav = favoritos.indexOf(favoritoAtualizado)
        if (indexFav > -1) {
            favoritos[indexFav].nome = novoNome.value;
            favoritos[indexFav].telefone = novoTelefone.value;
            localStorage.setItem('favoritos', JSON.stringify(favoritos))
        }

    }

    console.log('test', JSON.parse(localStorage.getItem('favoritos')))
    atualizacaoCard.innerHTML = '<h3>Salvando contato...</h3>';

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


    atualizacaoCard.style = "display:none!important";
    telaListaContatos.style = "opacity:100%!important"
    contatos.innerHTML = 'Atualizando...';
    atualizarContatos()

}

const editarPessoaContato = (id, tipo) => {
    let contatoEditavel;
    if (tipo === 'contato') {
        contatoEditavel = listaContatosFiltrado.filter(contato => Number(contato.id) === id)
    }
    if (tipo === 'favorito') {
        contatoEditavel = favoritos.filter(contato => Number(contato.id) === id)
    }
    telaListaContatos.style = "opacity:50%!important"
    atualizacaoCard.style = "display:flex!important"
    atualizacaoCard.innerHTML = "<div id= 'cardEdicao' class='d-flex flex-column position-fixed align-items-center justify-content-center rounded opacity-100 zindex-6 bg-white mt-5 h-25 p-5 border-dark'><h4>Edite seu contato:</h4><div class='d-flex flex-column justify-content-center'><input id='novoNome' placeholder='Novo Contato' value='" + contatoEditavel[0].nome + "' class='rounded mb-1' type='text' /> <input id='novoTelefone' placeholder='Novo Telefone' value='" + contatoEditavel[0].telefone + "'class='rounded mb-1'type='text'/></div><div class='d-flex align-items-center justify-content-center'><button class='bg-success rounded m-2' onclick='atualizarPessoa(" + id + ")'>Salvar<i class='fa-solid fa-upload text-white'></i></button><button class='bg-danger rounded' onclick='cancelarCard()'>Cancelar<i class='fa-solid fa-xmark text-white'></i></button></div></div>"
}
const cancelarCard = () => {
    atualizacaoCard.style = "display:none!important";
    telaListaContatos.style = "opacity:100%!important"
}

const deletarPessoa = async (id_pessoa) => {
    let favoritoAtualizado = favoritos.find(o => Number(o.id) === id_pessoa)
    let indexFav = favoritos.indexOf(favoritoAtualizado)
    if (indexFav > -1) {
        favoritos.splice(indexFav, 1);
    }
    localStorage.setItem('favoritos', JSON.stringify(favoritos))
    let contatoDeletado = await fetch(url + "/" + id_pessoa,
        {
            method: 'DELETE'
        }

    )
    console.log(id_pessoa, contatoDeletado);
    atualizarContatos();
}


document.getElementById("form").addEventListener("click", (event) => {
    event.preventDefault()
}); 