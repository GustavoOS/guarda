import os, { type NetworkInterfaceBase } from "node:os";

export function getIpv4Ips(): NetworkInterfaceBase[] {
	const nInterfaces = os.networkInterfaces();
	const ips = Object.values(nInterfaces)
		.flat()
		.filter((ip) => ip?.family === "IPv4");
	return ips;
}

export function findLocalNetwork({
	ip,
	networks,
}: {
	ip?: string;
	networks: NetworkInterfaceBase[];
}): NetworkInterfaceBase | undefined {
	if (!ip) {
		return undefined;
	}
	return networks.find(
		(network) => network.cidr !== null && isIp4InCidr(ip, network.cidr),
	);
}

function ip4ToInt(ip: string): number {
	return ip
		.split(".")
		.reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0);
}

const isIp4InCidr = (ip: string, cidr: string) => {
	const [range, bits = "32"] = cidr.split("/");
	const mask = ~(2 ** (32 - parseInt(bits, 10)) - 1);
	return (ip4ToInt(ip) & mask) === (ip4ToInt(range) & mask);
};

type IPIFYResponse = {
	ip: string;
};

export async function getPublicIp(): Promise<string> {
	const result = await fetch("https://api.ipify.org?format=json");
	if (!result.ok) {
		throw new Error(`Failed to fetch public IP: ${result.statusText}`);
	}
	const { ip } = (await result.json()) as IPIFYResponse;
	console.log("Public IP address:", ip);
	return ip;
}

export function normalizeIp(ip: string): string {
	if (ip === "::1") {
		return "127.0.0.1";
	}
	return ip.startsWith("::ffff:") ? ip.slice(7) : ip;
}
