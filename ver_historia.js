const firebaseConfig = {
    apiKey: "AIzaSyCydzm596p8_yNOjinJIBPr0CAvTFZ4Nm4",
    authDomain: "projeto-historia-c48e6.firebaseapp.com",
    databaseURL: "https://projeto-historia-c48e6-default-rtdb.firebaseio.com",
    projectId: "projeto-historia-c48e6",
    storageBucket: "projeto-historia-c48e6.appspot.com",
    messagingSenderId: "1045336762278",
    appId: "1:1045336762278:web:d87c056ffcaaa8d5abd167"
  };
  
    
    firebase.initializeApp(firebaseConfig);
    
    const database = firebase.database();
    
    document.getElementById('hist1').addEventListener('click', function() {
        exibirHistoria(1);
    });
    
    document.getElementById('hist2').addEventListener('click', function() {
        exibirHistoria(2);
    });
    
    document.getElementById('hist3').addEventListener('click', function() {
        exibirHistoria(3);
    });
    
    
    function exibirHistoria(numeroHistoria) {
        const historiasRef = database.ref('historias');
    
        historiasRef.once('value', function(snapshot) {
            const historias = snapshot.val();
    
            if (historias) {
                let contador = 0;
                let historiaEncontrada = false;
                for (const key in historias) {
                    contador++;
                    if (contador === numeroHistoria) {
                      mostrarMensagem_2("Turma: " + historias[key].turma + "\n" + "Título: " + historias[key].titulo + ".\n" + "Historia:" + historias[key].historia);
                        historiaEncontrada = true;
                        break;
                    }
                }
                if (!historiaEncontrada) {
                    mostrarMensagem("História não encontrada!");
                }
            } else {
                mostrarMensagem("Nenhuma história encontrada!");
            }
        });
    } // Japones que fez
    
    const emailInput = document.getElementById("email");
   
  function votar(historia) {
      const email = emailInput.value.trim();
      if (email.length === 0 || !isValidEmail(email)) {
          mostrarMensagem_2("Você deve digitar seu email institucional.");
          matriculaInput.value = '';
          return;
      }
  
      const cleanEmail = cleanEmailAddress(email);
  
      // Verificar se o usuário já votou
      // Verificar se a matricula já foi registrada
      database.ref(`email/${cleanEmail}`).once('value').then(emailSnapshot => {
          if (emailSnapshot.val() !== null) {
              mostrarMensagem_2("Você já votou. Apenas um voto por pessoa é permitido.")
              emailInput.value = ''
          } else {
              // Registrar a matricula
              database.ref(`email/${cleanEmail}`).set(true);
   
              // Registrar voto
              database.ref(`votos/${historia}`).transaction(contagemAtual => {
                  return (contagemAtual || 0) + 1;
              }, (error, committed, snapshot) => {
                  if (error) {
                      console.error('Erro ao atualizar a contagem de votos:', error);
                  } else if (committed) {
                      mostrarMensagem_2(`Você votou na ${historia}! Ótima escolha!`);
                      emailInput.value = ''
                      // Recarregar a página e limpar o campo da matrícula
                  } else {
                      mostrarMensagem_2("Você já votou. Apenas um voto por pessoa é permitido.");
                      emailInput.value = ''
                      // Limpar o campo da matrícula
                  }
              }).catch(error => {
                  console.error('Erro ao verificar o voto:', error);
                  // Limpar o campo da matrícula em caso de erro
                  emailInput.value = '';
              });
          }
      }).catch(error => {
          console.error('Erro ao verificar a matrícula:', error);
          // Limpar o campo da matrícula em caso de erro
          emailInput.value = '';
      });
  }
   
     
    document.getElementById('voto_1').addEventListener('click', function() {
        votar('história 1');
    });
     
    document.getElementById('voto_2').addEventListener('click', function() {
        votar('história 2');
    });
     
    document.getElementById('voto_3').addEventListener('click', function() {
        votar('história 3');
    });
     
  
  function mostrarMensagem(mensagem) {
      var mensagemContainer = document.createElement("div");
      mensagemContainer.className = "mensagem-container";
      mensagemContainer.innerHTML = "<p>" + mensagem + "</p>";
      
      document.body.appendChild(mensagemContainer);
  
      setTimeout(function() {
          mensagemContainer.remove();
      }, 3000);
  }
  
  function mostrarMensagem_2(mensagem) {
      // Criação do container da mensagem
      var mensagemContainer = document.createElement("div");
      mensagemContainer.className = "mensagem-container";
  
      // Adição do conteúdo da mensagem e botão de fechar
      mensagemContainer.innerHTML = `
          <p style="white-space: pre-line;">${mensagem}</p>
          <button class="fechar-btn" onclick="fecharMensagem(this)">Fechar</button>
      `;
  
      // Adiciona o container ao corpo do documento
      document.body.appendChild(mensagemContainer);
  
  }
  
  // Função para fechar a mensagem quando o botão de fechar é clicado
  function fecharMensagem(botao) {
      // Obtém o elemento pai do botão (o container da mensagem) e o remove
      var mensagemContainer = botao.parentNode;
      mensagemContainer.remove();
  }
  
  
  function isValidEmail(email) {
      // Expressão regular para validar o formato do e-mail
      const emailRegex = /^[a-zA-Z0-9._%+-]+@senacsp.edu.br$/;
      return emailRegex.test(email);
  }
  
  function cleanEmailAddress(email) {
      return email.replace(/[.#$[\]]/g, '');
  }