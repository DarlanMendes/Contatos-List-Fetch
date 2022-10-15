//let url='https://633867b7937ea77bfdbf9c86.mockapi.io/pessoa';
let url='https://634ab69d33bb42dca4099305.mockapi.io/contact'
atualizacaoCard.style="display:none";
const addContact=async()=>{
    console.log('nome',nome.value,'idade',idade.value)
    let resultado = await fetch(url,
    {
        method:'POST',
        headers:{'Accept': 'application/json',
        'Content-Type': 'application/json'},
        body:JSON.stringify({nome:nome.value,idade:idade.value})
    }
    
    );
    nome.value='';
    idade.value='';
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
            conteudoHtml+="<li>"+`${index+1}`+". " +pessoa.nome+" - "+pessoa.idade+" anos <button onclick='deletarPessoa("+pessoa.id+")'>Deletar</button> <button onclick='editarPessoa("+pessoa.id+")'>Editar</button></li>" 
        })
        contatos.innerHTML=conteudoHtml;
    })
}
const editarPessoa=(id_pessoa)=>{
    atualizacaoCard.style="display:fixed";
    atualizacaoCard.style="z-index:5";
    atualizacaoCard.innerHTML=" <div><input id='novoNome' placeholder='Novo Nome' type='text' /> <input id='novaIdade' placeholder='Nova Idade' type='number'/></div><div><button onclick='atualizarPessoa("+id_pessoa+")'>Atualizar</button><button onclick='cancelarCard()'>Cancelar</button></div>  "
    console.log(id_pessoa)
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
    console.log('teste', novoNome.value)
   let atualizado = await fetch(url+"/"+id_pessoa,
    {
        method:'PUT',
        headers:{'Accept': 'application/json',
        'Content-Type': 'application/json'},
        body:JSON.stringify({
            nome:novoNome.value,idade:novaIdade.value
        })
    }
    
    )
atualizarContatos();
   console.log(atualizado)
}

document.getElementById("form").addEventListener("click", (event)=>{
    event.preventDefault()
  }); 