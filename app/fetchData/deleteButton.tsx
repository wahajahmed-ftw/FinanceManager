"use client"
interface DeleteButtonProps {
    id: number;
}

export default function DeleteButton({ id }: DeleteButtonProps) {
    async function DeleteUser() {
        console.log(id)
        await fetch(`https://67c1eabf61d8935867e4b8f8.mockapi.io/users/${id}`, {
            method: "DELETE",
        })
        window.location.reload()
    }
    return (
        <div>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={DeleteUser}>Delete</button>
        </div>
    );
}