let url='https://633867b7937ea77bfdbf9c86.mockapi.io/pessoa';
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
    console.log(resultado.statusText)
}
const atualizarContatos=()=>{
    fetch(url).
    then(resposta=>resposta.json()).
    then(body=>{
        console.log('dentro',body);
        let conteudoHtml='';
        body.forEach((pessoa,index)=>{
            conteudoHtml+="<li>"+`${index+1}`+". " +pessoa.nome+" - "+pessoa.idade+" anos <button onclick='deletarPessoa("+pessoa.id+")'>Deletar</button> <button onclick='editarPessoa("+pessoa.id+")'>Atualizar</button></li>" 
        })
        contatos.innerHTML=conteudoHtml;
    })
}
const editarPessoa=()=>{
    atualizacaoCard.style="display:absolute";
    atualizacaoCard.style="z-index:5";
}
const cancelarCard=()=>{
    atualizacaoCard.style="display:none";
}

const deletarPessoa=(id_pessoa)=>{
    fetch(url+"/"+id_pessoa,
    {
        method:'DELETE'
    }

    ).then(atualizarContatos())
   console.log(id_pessoa)
}
const atualizarPessoa=(id_pessoa)=>{
    fetch(url+"/"+id_pessoa,
    {
        method:'DELETE',
        body:JSON.stringify({
            nome:nome.value,idade:idade.value
        })
    }

    ).then(atualizarContatos())
   console.log(id_pessoa)
}

document.getElementById("form").addEventListener("click", (event)=>{
    event.preventDefault()
  }); 