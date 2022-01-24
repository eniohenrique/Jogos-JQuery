var campo = $(".campo-digitacao");
$("#tempo").text($("#tamanho-frase").text() / 3);
var tempoInicial = $("#tempo").text();

var x = $("textarea")
console.log(x.hasClass());

$(function () {
    inicializaCronometro();
    atualizaTamanhoFrase();
    inicializaContadores();
    atualizaPlacar();
});

//$("#botao-reiniciar").on("click",btn{
// mesmo codigo esse de baixo
$(".botao-remover").click(btnRemover);

$("#botao-reiniciar").click(btnReiniciar);

$("#botao-placar").click(btnPlacar);

$("#botao-frase").click(btnFrase);

$("#botao-escolher").click(btnEscolher);

$("#botao-sync").click(sincronizaPlacar);

campo.on("input", digitacaoCerta);




function sincronizaPlacar(){
    var placar = []
    var linhas = $("tbody tr"); // pegando o tbody que tem tr dentro
    linhas.each(function(){
        //pegando a primeira linha dentro do td td:nth-child(1)
        var usuario=$(this).find("td:nth-child(1)").text();
        //pegando a segunda linha dentro do td td:nth-child(2)
        var palavras=$(this).find("td:nth-child(2)").text();
        
        var score = {

            usuario: usuario,
            pontos: palavras

        };
        placar.push(score)
    })

    var dados = {
        placar:placar
    }

    $.post("http://localhost:3000/placar", dados, function(){
        console.log("deu certo")
    });

}

function atualizaPlacar(){
    $.get("http://localhost:3000/placar",function(data){
        $(data).each(function(){
            var nPlacar=placar(this.usuario,this.pontos)
            $("tbody").append(nPlacar)
        })

    })

}


function digitacaoCerta() {
    var frase = $(".frase").text();
    var digitado = campo.val();
    var comparavel = frase.substr(0, digitado.length)
    if (comparavel == digitado) {
        campo.removeClass("campo-digitacao-errado")
        campo.addClass("campo-digitacao-certo")
    } else {
        campo.removeClass("campo-digitacao-certo")
        campo.addClass("campo-digitacao-errado")
    }
}

function btnEscolher() {
    $("#spinner").show();
    var numFrase = $("#escolherFrase").val();
    $.get("http://localhost:3000/frases", function (data) {
        if (numFrase < data.length) {
            $(".frase").text(data[numFrase].texto)
            $("#tempo").text(data[numFrase].tempo)
            atualizaTamanhoFrase();
            campo.on("input", digitacaoCerta)
            return tempoInicial = $("#tempo").text();
        } else {
            alert("Numero de frase incorreta\nentre com o numero de 0 a " + (data.length - 1))
        }
    }).fail(function () {
        $("#erro").show();
    }).always(function () {
        $("#spinner").hide();
    })
}

function btnFrase() {
    $("#spinner").show();
    $.get("http://localhost:3000/frases", function (data) {
        var i = Math.floor(Math.random() * data.length)
        $(".frase").text(data[i].texto)
        $("#tempo").text(data[i].tempo)
        atualizaTamanhoFrase();
        campo.on("input", digitacaoCerta)
        return tempoInicial = $("#tempo").text();
    }).fail(function () {
        $("#erro").show();
    }).always(function () {
        $("#spinner").hide();
    })
}


function btnPlacar() {
    $("#placar").stop().slideToggle(800)
}

function btnReiniciar() {
    campo.attr("disabled", false)
    campo.val("");
    $("#contador-caracteres").text("0");
    $("#contador-palavras").text("0");
    $("#tempo").text(tempoInicial);
    campo.removeClass("campo-digitacao-dasabilitado")
    campo.removeClass("campo-digitacao-certo")
    campo.removeClass("campo-digitacao-errado")
    inicializaCronometro();
    $(".placar").slideUp(500);
}


function btnRemover(event) {
    event.preventDefault();
    $(this).parent().parent().fadeOut();
    setInterval(() => {
        $(this).parent().parent().remove();
    }, 2000);
}

function trocarFrase() {
    var i = Math.floor(Math.random() * data.length)
    $(".frase").text(data[i].texto)
    $("#tempo").text(data[i].tempo)
    atualizaTamanhoFrase();
    campo.on("input", digitacaoCerta)
    return tempoInicial = $("#tempo").text();
}


function atualizaTamanhoFrase() {
    var frase = $(".frase").text();
    var numeroPalavras = frase.split(" ").length;
    var tamanhoFrase = $("#tamanho-frase");
    tamanhoFrase.text(numeroPalavras);
};

function inicializaContadores() {
    campo.on("input", function () {
        var fraseDigitada = campo.val();
        $("#contador-caracteres").text(fraseDigitada.length);

        var qtdPalavras = fraseDigitada.split(" ").length;
        $("#contador-palavras").text(qtdPalavras);
    })
};

function inicializaCronometro() {
    var tempo = $("#tempo").text();
    campo.one("focus", function () {
        var cronometroID = setInterval(() => {
            tempo--;
            $("#tempo").text(tempo);
            if (tempo < 1) {
                campo.attr("disabled", true)
                clearInterval(cronometroID);
                campo.addClass("campo-digitacao-dasabilitado")
                inserePlacar();
            }
        }, 1000);

    })
};

function inserePlacar() {
    var corpoTabela = $(".placar").find("tbody");
    var jogador = $("#nome").val();
    var numPalavras = $("#contador-palavras").text();

    if (jogador.length > 1) {
        if ($(".campo-digitacao").hasClass("campo-digitacao-certo")) {
            corpoTabela.append(placar(jogador, numPalavras));
        } else {
            alert("Seu placar não foi computado pois você errou alguma palavra !!!")
        }
    } else {
        alert("Campo jogador obrigatorio !")
    }

    $(".placar").slideDown(500);

    $('html, body').animate({ scrollTop: $(".placar").offset().top }, 700);

}


function placar(jogador, palavras) {
    var tr = $("<tr>");
    var colunaJogador = $("<td>").text(jogador);
    var colunaNumPalavras = $("<td>").text(palavras);
    var colunaRemover = $("<td>");

    var a = $("<a>").addClass("botao-remover").attr("href", "#");
    a.click(btnRemover);

    var i = $("<i>").addClass("small").addClass("material-icons").text("delete");

    a.append(i);
    colunaRemover.append(a)
    tr.append(colunaJogador)
    tr.append(colunaNumPalavras)
    tr.append(colunaRemover);

    return tr;
}


/*
AJAX
metodo para pegar o item de id 5
$.get("http://localhost:3000/frases",{id: 5},function (data) {
    console.log(data)
})
*/