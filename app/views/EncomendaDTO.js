
class EncomendaDTO {

    createDTO(encomenda) {
        return {
            orderId: encomenda._id,
            name: encomenda.name,
            date: encomenda.date,
            address: encomenda.address,
            itens: encomenda.itens,
        }
    }
}

module.exports = new EncomendaDTO();