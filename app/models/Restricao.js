const fetch = require('node-fetch');

exports.checkDimensao = function (package) {

    if (package.alturamaxproduto != 0) {
        if (package.alturaproduto > package.alturamaxproduto) {
            return false;
        }
    }

    if (package.larguramaxproduto != 0) {
        if (package.larguraproduto > package.larguramaxproduto) {
            return false;
        }
    }

    if (package.profundidademaxproduto != 0) {
        if (package.profundidadeproduto > package.profundidademaxproduto) {
            return false;
        }
    }

    return true;
}

exports.checkMateriaisAcabamentos = function (package, aux) {

    var materiaisAcabamentos = new Array();
    var material;
    var acabamentos = new Array();
    var countFinishes = 0;
    var countMaterialFinishes = 0;


    if (aux.materials.length != 0) {
        materiaisAcabamentos = package.materiaisAcabamentos.split(';');

        for (var i = 0; i < materiaisAcabamentos.length; i++) {
            material = materiaisAcabamentos[i].slice(0, materiaisAcabamentos[i].indexOf("acabamentos") - 5).trim();
            var acabamentos = materiaisAcabamentos[i].slice(materiaisAcabamentos[i].indexOf("acabamentos") + 15).trim().split(',');

            for (var q = 0; q < aux.materials.length; q++) {
                if (aux.materials[q].name == material) {
                    for (var j = 0; j < acabamentos.length; j++) {
                        for (var k = 0; k < aux.materials[q].finishes.length; k++) {
                            if (aux.materials[q].finishes[k].name == acabamentos[j]) {
                                countFinishes++;
                            }
                        }
                    }
                    if (acabamentos.length == countFinishes) {
                        countMaterialFinishes++;
                    }
                    countFinishes = 0;
                }
            }
        }
    }else{
        return true;
    }

    if (materiaisAcabamentos.length == countMaterialFinishes) {
        return true;
    } else {
        return false;
    }
}

exports.checkParte = async function (parte, produto) {

    var aux;

    var url = 'https://lapr5-gc.azurewebsites.net/api/combination';
    await fetch(url).then(res => res.json())
        .then(json =>
            aux = json
        );

    for (var i = 0; i < aux.length; i++) {
        if (aux[i].containingProduct == produto && aux[i].containedProduct == parte) {
            return true;
        }
    }

    return false;
}
