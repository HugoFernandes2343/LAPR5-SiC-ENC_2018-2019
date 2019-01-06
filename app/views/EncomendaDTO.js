
class EncomendaDTO {

    createDTO(encomenda) {
        return {
            orderId: encomenda._id,
            name: encomenda.name,
            date: encomenda.date,
            address: encomenda.address,
            status: encomenda.status,
            itens: encomenda.itens,
        }
    }
}

module.exports = new EncomendaDTO();