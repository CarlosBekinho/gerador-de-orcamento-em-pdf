document.getElementById('adicionarItem').addEventListener('click', function () {
    const tabela = document.getElementById('tabelaVendas').getElementsByTagName('tbody')[0];
    const newRow = tabela.insertRow(-1);

    const cols = [
        { name: 'quantidade', type: 'number' },
        { name: 'descricao', type: 'text' },
        { name: 'valorUnitario', type: 'number' },
        { name: 'valorTotalItem', type: 'text' }
    ];

    cols.forEach(col => {
        const cell = newRow.insertCell(-1);
        const input = document.createElement('input');
        input.type = col.type;
        input.setAttribute('placeholder', col.name.charAt(0).toUpperCase() + col.name.slice(1));
        input.classList.add('inputTable');
        cell.appendChild(input);

        if (col.type === 'number') {
            input.addEventListener('input', function () {
                calcularTotal();
            });
        }
    });
});


function calcularTotal() {
    let total = 0;
    const linhasTabela = document.getElementById('tabelaVendas').getElementsByTagName('tbody')[0].getElementsByTagName('tr');

    for (let i = 0; i < linhasTabela.length; i++) {
        const quantidade = parseFloat(linhasTabela[i].cells[0].querySelector('input').value) || 0;
        const valorUnitario = parseFloat(linhasTabela[i].cells[2].querySelector('input').value) || 0;
        const valorTotalItem = quantidade * valorUnitario;
        linhasTabela[i].cells[3].querySelector('input').value = valorTotalItem.toFixed(2);
        total += valorTotalItem;
    }

    document.getElementById('total').textContent = total.toFixed(2);
}


const pdfGerar = document.getElementById('gerarPDF');
pdfGerar.addEventListener('click', gerarPDF);

function gerarPDF() {
    const doc = new jsPDF(); 

  
    const logo = new Image();
    logo.src = "./src/images/logo.png"; 

    logo.onload = function() {
        const pdfWidth = doc.internal.pageSize.getWidth();

        
        const aspectRatio = logo.width / logo.height;
        const imgHeight = 20; 
        const imgWidth = imgHeight * aspectRatio;

        
        const posX = (pdfWidth - imgWidth) / 2;
        doc.addImage(logo, 'PNG', posX, 10, imgWidth, imgHeight);


        
        const nomeCliente = document.getElementById('nomeCliente').value;
        const telefone = document.getElementById('telefone').value;
        const email = document.getElementById('email').value;
        const endereco = document.getElementById('endereco').value;

        const clienteText = `Nome: ${nomeCliente}\n\nTelefone: ${telefone}\n\nE-mail: ${email}\n\nEndereço: ${endereco}`;
        const clienteFontSize = 12;

        const clienteLines = doc.splitTextToSize(clienteText, pdfWidth / 2 - 20, { fontSize: clienteFontSize }); 
        doc.setFontSize(clienteFontSize);
        doc.text(10, 50, clienteLines);


        const dataAtual = new Date().toLocaleDateString();
        const horaAtual = new Date().toLocaleTimeString();
        const dataHoraText = `Data: ${dataAtual}\nHora: ${horaAtual}`;
        const dataHoraFontSize = 12;

        const dataHoraLines = doc.splitTextToSize(dataHoraText, pdfWidth / 2 - 20); 
        const dataHoraX = pdfWidth / 2 + 50; 

        doc.setFontSize(dataHoraFontSize);
        doc.text(dataHoraLines, dataHoraX, 50);

    
     

        
        const linhasTabela = document.getElementById('tabelaVendas').getElementsByTagName('tbody')[0].getElementsByTagName('tr');
        const rowData = [];
        
        for (let i = 0; i < linhasTabela.length; i++) {
            const cells = linhasTabela[i].querySelectorAll('td');
            const row = {
                'Quantidade': cells[0].querySelector('input').value,
                'Descrição': cells[1].querySelector('input').value,
                'Valor Unitário': cells[2].querySelector('input').value,
                'Valor Total': cells[3].querySelector('input').value
            };
            rowData.push(row);
        }

        const startYPosition = 110; 

       
        doc.autoTable({
            head: [Object.keys(rowData[0])],
            body: rowData.map(Object.values),
            startY: startYPosition,
            theme: 'grid',
            headStyles: {
                fillColor: [50, 0, 245],
                textColor: [255, 255, 255]
            }
        });

        
        const valorTotal = parseFloat(document.getElementById('total').textContent) || 0;
        doc.text(`Valor Total do Orçamento: R$ ${valorTotal.toFixed(2)}`, 10, startYPosition + (rowData.length * 10) + 20);

        
        doc.save(`${nomeCliente} - Orçamento .pdf`);
    };
}






