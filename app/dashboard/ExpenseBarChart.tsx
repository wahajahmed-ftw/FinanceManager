import { useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";

export default function ExpenseBarChart({ data }: { data: Record<string, number> }) {
  const { scene } = useThree();

  const bars = useMemo(() => {
    const categories = Object.keys(data);
    return categories.map((category, i) => {
      const amount = data[category] / 100; // Scale down for visibility
      return (
        <mesh key={category} position={[i * 2 - categories.length, amount / 2, 0]}>
          <boxGeometry args={[1, amount, 1]} />
          <meshStandardMaterial color="cyan" />
          {/* Label Above the Bar */}
          <Html position={[0, amount / 2 + 0.5, 0]}>
            <div className="text-xs font-bold text-white bg-black p-1 rounded">
              {category} (${data[category]})
            </div>
          </Html>
        </mesh>
      );
    });
  }, [data]);

  return <group>{bars}</group>;
}
