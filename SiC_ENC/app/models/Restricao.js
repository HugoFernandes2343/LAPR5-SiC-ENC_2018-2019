
exports.checkDimensao = function (package) {
    if (package.alturaproduto > package.alturamaxproduto || package.alturaproduto < package.alturaminproduto) {
        return false;
    }

    if (package.larguraproduto > package.larguramaxproduto || package.larguraproduto < package.larguraminproduto) {
        return false;
    }

    if (package.profundidadeproduto > package.profundidademaxproduto || package.profundidadeproduto < package.profundidademinproduto) {
        return false;
    }

    return true;
}

exports.checkOcupacao = function (package) {

    var volumeProduto = package.alturaproduto * package.larguraproduto * package.profundidadeproduto;

    var volumeParte = package.alturaparte * package.larguraparte * package.profundidadeparte;


    var taxaOcupacao = volumeParte * 100 / volumeProduto;

    if (package.taxaatual == 0) {
        if (taxaOcupacao < package.maxtaxaocupacao) {
            package.maxTaxaAtual = taxaOcupacao;
            return true;
        }
    } else {
        if (taxaOcupacao + package.taxaatual < package.maxtaxaocupacao) {
            package.taxaatual = taxaOcupacao + package.taxaatual;
            return true;
        }
    }
    return false;
}

exports.checkMaterial = function (package) {

    var count = 0;
    package.materialPartes.forEach(item => {
        var result = false;
        package.materialProduto.forEach(item2 => {
            if (item2 == item) {
                result = true;
            }
        })

        if (result == false) {
            count++;
        }
    });

    if (count == 0) {
        return true;
    } else {
        return false;
    }
}

exports.checkCaber = function (package) {

    if (package.alturaparte > package.alturaproduto) {
        return false;
    }

    if (package.larguraparte > package.larguraproduto) {
        return false;
    }

    if (package.profundidadeparte > package.profundidadeproduto) {
        return false;
    }

    return true;

}
