
class EncomendaDTO {

    createDTO(encomenda) {
        return {
            encomendaId: encomenda._id,
            name: encomenda.name,
            date: encomenda.date,
            address: encomenda.address,
            cost: encomenda.cost,
            itens: encomenda.itens,
        }
    }
}

module.exports = new EncomendaDTO();