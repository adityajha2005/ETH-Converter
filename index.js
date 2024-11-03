const WEI_PER_ETHER = BigInt("1000000000000000000");
const GWEI_PER_ETHER = BigInt("1000000000");

let currentEthPrice = 2431.84;

document.addEventListener('DOMContentLoaded', function() {
    const weiInput = document.getElementById('wei');
    const gweiInput = document.getElementById('gwei');
    const etherInput = document.getElementById('ether');
    const priceDisplay = document.getElementById('price');
    const priceRate = document.querySelector('.price-rate');

    function handleWeiInput(value) {
        if (!value) return;
        try {
            const wei = BigInt(value);
            const ether = Number(wei) / Number(WEI_PER_ETHER);
            const gwei = Number(wei) / 1000000000;
            
            etherInput.value = ether;
            gweiInput.value = gwei;
            updatePrice(ether);
        } catch (error) {
            console.error('Invalid Wei input:', error);
        }
    }
    function handleGweiInput(value) {
        if (!value) return;
        try {
            const gwei = BigInt(value);
            const wei = gwei * BigInt(1000000000);
            const ether = Number(gwei) / Number(GWEI_PER_ETHER);
            
            weiInput.value = wei.toString();
            etherInput.value = ether;
            updatePrice(ether);
        } catch (error) {
            console.error('Invalid Gwei input:', error);
        }
    }

    function handleEtherInput(value) {
        if (!value) return;
        try {
            const ether = parseFloat(value);
            const wei = BigInt(Math.floor(ether * Number(WEI_PER_ETHER)));
            const gwei = ether * Number(GWEI_PER_ETHER);
            
            weiInput.value = wei.toString();
            gweiInput.value = gwei.toString();
            updatePrice(ether);
        } catch (error) {
            console.error('Invalid Ether input:', error);
        }
    }

    function updatePrice(etherValue) {
        const totalPrice = (etherValue * currentEthPrice).toFixed(2);
        priceDisplay.textContent = `$ ${totalPrice}`;
        priceRate.textContent = `(${currentEthPrice.toFixed(2)}$/Ether)`;
    }

    weiInput.addEventListener('input', (e) => handleWeiInput(e.target.value));
    gweiInput.addEventListener('input', (e) => handleGweiInput(e.target.value));
    etherInput.addEventListener('input', (e) => handleEtherInput(e.target.value));

    async function fetchEthPrice() {
        try {
            const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
            const data = await response.json();
            currentEthPrice = data.ethereum.usd;
            updatePrice(parseFloat(etherInput.value) || 1);
        } catch (error) {
            console.error('Error fetching ETH price:', error);
        }
    }

    fetchEthPrice();
    setInterval(fetchEthPrice, 30000);

    handleEtherInput('1');
});

function isValidNumber(value) {
    return !isNaN(value) && value.trim() !== '';
}