export class ConnectionStrings {
    public static readonly backend = process.env.NODE_ENV == "development" ? "https://localhost:1789/api/" : "https://localhost:1789/";
}