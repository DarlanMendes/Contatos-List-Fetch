//let url='https://633867b7937ea77bfdbf9c86.mockapi.io/pessoa';
let logado = JSON.parse(localStorage.getItem('Logado'));
console.log(logado)

const fazerLogin=()=>{
    if(login.value&&senha.value){
        if(login.value==='login'&&senha.value==='senha'){
            localStorage.setItem('Logado',JSON.stringify({'login':'login','senha':'senha'}));
            window.location='index.html'
        }
    }else{
        aviso.innerHTML="Por favor digite todos os campos"
    }
}
let url='https://634ab69d33bb42dca4099305.mockapi.io/contact'
atualizacaoCard.style="display:none";
const addContact=async()=>{
    let resultado = await fetch(url,
    {
        method:'POST',
        headers:{'Accept': 'application/json',
        'Content-Type': 'application/json'},
        body:JSON.stringify({nome:nome.value,telefone:telefone.value})
    }
    
    );
    nome.value='';
    telefone.value='';
    console.log(resultado.statusText);
    atualizarContatos();
}
const atualizarContatos=()=>{
    contatos.innerHTML='Atualizando contatos...'
    fetch(url).
    then(resposta=>resposta.json()).
    then(body=>{
        console.log('dentro',body);
        let conteudoHtml='';
        body.forEach((pessoa,index)=>{
            conteudoHtml+="<li class='d-flex justify-content-between'>"+`${index+1}`+". <h4>" +pessoa.nome+" </h4>  "+pessoa.telefone+"<div> <button class='bg-danger rounded text-white' onclick='deletarPessoa("+pessoa.id+")'><i class='fa-solid fa-trash'></i></button> <button class='bg-primary rounded text-white' onclick='editarPessoa("+index+")'><i class='fa-solid fa-pen'></i></button></div></li>" 
        })
        contatos.innerHTML=conteudoHtml;
    })
}
const editarPessoa=(linhaContato)=>{
    console.log(linhaContato)
    atualizacaoCard.style="display:fixed";
    atualizacaoCard.style="z-index:5";
    atualizacaoCard.innerHTML="<div class='d-flex position-fixed bg-white mt-5 h-25 p-5 border-dark'><div><input id='novoNome' placeholder='Novo Contato' value='"+nome+"' class='rounded mb-1' type='text' /> <input id='novoTelefone' placeholder='Novo Telefone' value='"+telefone+"' class='rounded mb-1'type='text'/></div> <div class='d-flex align-items-center'><button class='bg-success rounded m-2' onclick='atualizarPessoa("+id+")'><i class='fa-solid fa-upload text-white'></i></button><button class='bg-danger rounded' onclick='cancelarCard()'><i class='fa-solid fa-xmark text-white'></i></button></div></div>"
    //console.log(id_pessoa)
}
const cancelarCard=()=>{
    atualizacaoCard.style="display:none";
}

const deletarPessoa= async (id_pessoa)=>{
    let contatoDeletado = await fetch(url+"/"+id_pessoa,
    {
        method:'DELETE'
    }

    )
   console.log(id_pessoa, contatoDeletado);
   atualizarContatos();
}
const atualizarPessoa= async (id_pessoa)=>{
    console.log('id pessoa', id_pessoa)
   let atualizado = await fetch(url+"/"+id_pessoa,
    {
        method:'PUT',
        headers:{'Accept': 'application/json',
        'Content-Type': 'application/json'},
        body:JSON.stringify({
            nome:novoNome.value,telefone:novoTelefone.value
        })
    }
    
    )
    atualizacaoCard.style="display:none";
    contatos.innerHTML='Atualizando...'
    console.log(atualizado);
    
await atualizarContatos();
   
   
}

document.getElementById("form").addEventListener("click", (event)=>{
    event.preventDefault()
  }); 