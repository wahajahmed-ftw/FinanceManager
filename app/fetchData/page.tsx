import Image from "next/image"
import { revalidatePath } from "next/cache";
import DeleteButton from "./deleteButton";

interface User {
    id: number;
    name: string;
}

export default async function Fetchdata() {
    const res = await fetch("https://67c1eabf61d8935867e4b8f8.mockapi.io/users")
    const users = await res.json()

    async function addUser(formdata: FormData) {
        "use server"
        const name = formdata.get("name")
        const res = await fetch("https://67c1eabf61d8935867e4b8f8.mockapi.io/users", {
            method: "POST",
            body: JSON.stringify({ name }),
            headers: { "Content-Type": "application/json" },
        })
        await res.json()
        revalidatePath("/fetchData")
    }

    return (
        <div className="p-4">
            <form action={addUser} className="mb-4 flex gap-2">
                <input 
                    type="text"
                    placeholder="Name"
                    className="p-2 border border-gray-300 rounded text-gray-700 text-white"
                    name="name"
                />
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Submit</button>
            </form>

            <h2 className="text-lg font-bold mb-2">Users</h2>
            <div className="space-y-2">
                {users.map((user: User) => (
                    <div key={user.id} className="flex items-center justify-between border-b pb-2">
                        <h4 className="text-white-800">Id: {user.id} - Name: {user.name}</h4>
                        <DeleteButton id={Number(user.id)} />
                    </div>
                ))}
            </div>
        </div>
    )
}
