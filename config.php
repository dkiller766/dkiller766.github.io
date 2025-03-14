<?php
if(isset($_POST['cadastrar'])){
    $name = $_POST['nome'];
    $email = $_POST['email'];
    $telefone = $_POST['telefone'];
    $endereço = $_POST['endereço'];
}
$Host = "localhost";
$banco = "cadastro";
$user = "root";
$senha_user = "";
$conexao = mysqli_connect($Host, $user, $senha_user, $banco);
if(!$conexao){
    echo "Falha na conexão com o banco de dados";
}
else{
    echo "Conexão realizada com sucesso";
}
$sql = "INSERT INTO cadastro (nome, email, telefone, endereço) VALUES ('$name', '$email', '$telefone', '$endereço')";
if(mysqli_query($conexao, $sql)){
    echo "Cadastro realizado com sucesso";
}
else{
    echo "Erro ao cadastrar";
}
?>