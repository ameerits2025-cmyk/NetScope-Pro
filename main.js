function maskFromCIDR(cidr) {
    let mask = [];
    for (let i = 0; i < 4; i++) {
        let n = Math.min(8, cidr);
        mask.push(256 - Math.pow(2, 8 - n));
        cidr -= n;
    }
    return mask.join('.');
}

function analyzeIP() {

    const input = document.getElementById("ipInput").value.trim();
    const res = document.getElementById("results");
    const history = document.getElementById("history");

    if (!input) {
        res.innerHTML = "⚠️ أدخل IP";
        return;
    }

    let [ip, cidr] = input.split('/');
    cidr = cidr ? parseInt(cidr) : 24;

    const ipParts = ip.split('.').map(Number);

    if (ipParts.length !== 4 || ipParts.some(x => x < 0 || x > 255)) {
        res.innerHTML = "⚠️ IP غير صحيح";
        return;
    }

    const mask = maskFromCIDR(cidr);
    const maskParts = mask.split('.').map(Number);

    const network = ipParts.map((v,i) => v & maskParts[i]).join('.');
    const broadcast = ipParts.map((v,i) => v | (255 - maskParts[i])).join('.');
    const hosts = Math.pow(2, 32 - cidr) - 2;

    const first = ipParts[0];
    const ipClass =
        first <= 126 ? "A" :
        first <= 191 ? "B" :
        first <= 223 ? "C" : "Other";

    const binary = ipParts.map(n =>
        n.toString(2).padStart(8,'0')
    ).join('.');

    const resultText = `
        📌 IP: ${ip}/${cidr}<br>
        <hr>
        🟦 Class: ${ipClass}<br>
        🟩 Mask: ${mask}<br>
        🟨 Network: ${network}<br>
        🟥 Broadcast: ${broadcast}<br>
        👥 Hosts: ${hosts}<br>
        💻 Binary: ${binary}
    `;

    res.innerHTML = resultText;

    // History
    history.innerHTML += `<div>✔ ${ip}/${cidr} → ${network}</div>`;
}

function resetTool() {
    document.getElementById("ipInput").value = "";
    document.getElementById("results").innerHTML = "";
}