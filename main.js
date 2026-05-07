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
        res.innerHTML = "⚠️ يرجى إدخال عنوان IP/CIDR";
        return;
    }

    let [ip, cidr] = input.split('/');
    cidr = cidr ? parseInt(cidr) : 24;
    const ipParts = ip.split('.').map(Number);

    if (ipParts.length !== 4 || ipParts.some(x => x < 0 || x > 255)) {
        res.innerHTML = "⚠️ عنوان IP غير صحيح";
        return;
    }

    const mask = maskFromCIDR(cidr);
    const maskParts = mask.split('.').map(Number);

    const networkParts = ipParts.map((v, i) => v & maskParts[i]);
    const broadcastParts = ipParts.map((v, i) => v | (255 - maskParts[i]));
    
    const network = networkParts.join('.');
    const broadcast = broadcastParts.join('.');
    const hosts = Math.pow(2, 32 - cidr) - 2;

    // حساب أول وآخر IP متاح (Range)
    let firstUsable = [...networkParts]; firstUsable[3] += 1;
    let lastUsable = [...broadcastParts]; lastUsable[3] -= 1;

    const firstOctet = ipParts[0];
    const ipClass = firstOctet <= 126 ? "A" : firstOctet <= 191 ? "B" : firstOctet <= 223 ? "C" : "Other";

    res.innerHTML = `
        <div style="line-height: 1.8;">
            📌 <strong>IP Address:</strong> ${ip}/${cidr}<br>
            <hr style="border: 0.5px solid #333;">
            🟦 <strong>Class:</strong> ${ipClass}<br>
            🟩 <strong>Subnet Mask:</strong> ${mask}<br>
            🟨 <strong>Network ID:</strong> ${network}<br>
            🟥 <strong>Broadcast:</strong> ${broadcast}<br>
            🌐 <strong>Usable Range:</strong> ${firstUsable.join('.')} - ${lastUsable.join('.')}<br>
            👥 <strong>Total Hosts:</strong> ${hosts > 0 ? hosts.toLocaleString() : 0}
        </div>
    `;

    history.innerHTML = `<div style="padding: 5px 0; border-bottom: 1px solid #222;">✔ ${ip}/${cidr} → ${network}</div>` + history.innerHTML;
}

function resetTool() {
    document.getElementById("ipInput").value = "";
    document.getElementById("results").innerHTML = "";
}
