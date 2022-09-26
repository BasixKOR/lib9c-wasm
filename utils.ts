import uuid from "uuid";
import { isAddress } from "@ethersproject/address"

export function parseHex(hex: string): Uint8Array {
    return Uint8Array.from(Buffer.from(hex, "hex"));
}

export function toHex(buf: Uint8Array): string {
    return Buffer.from(buf).toString("hex");
}

interface DotnetType {
    serializeAsDotnet(): any;
}

export class Guid implements DotnetType {
    constructor(private readonly raw: string) {
        if (!uuid.validate(raw)) {
            throw new Error("Not suitable for Guid");
        }
    }

    serializeAsDotnet() {
        return this.raw;
    }
}

export class Address implements DotnetType {
    constructor(private readonly raw: string) {
        if (!isAddress(raw)) {
            throw new Error("Invalid Address.");
        }
    }

    serializeAsDotnet() {
        return this.raw;
    }
}

export function serializeObjectAsDotnet(obj: Object): Object {
    if (!(obj instanceof Object)) {
        return obj;
    }

    if (obj instanceof Address) {
        return obj.serializeAsDotnet();
    }

    if (obj instanceof Guid) {
        return obj.serializeAsDotnet();
    }

    return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, serializeObjectAsDotnet(v)]));
}