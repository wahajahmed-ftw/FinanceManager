import { useMemo } from "react";
import { useThree } from "@react-three/fiber";

export default function ExpensePieChart({ data }: { data: Record<string, number> }) {
  const { scene } = useThree();

  const total = Object.values(data).reduce((sum, val) => sum + val, 0);
  let startAngle = 0;

  const slices = useMemo(() => {
    return Object.entries(data).map(([category, value], i) => {
      const angle = (value / total) * Math.PI * 2;
      const midAngle = startAngle + angle / 2;
      const x = Math.cos(midAngle) * 2;
      const y = Math.sin(midAngle) * 2;
      startAngle += angle;

      return (
        <mesh key={category} position={[x, 0, y]} rotation={[0, -startAngle, 0]}>
          <cylinderGeometry args={[1, 1, 0.2, 32, 1, false, startAngle, angle]} />
          <meshStandardMaterial color={["red", "green", "blue", "yellow", "purple"][i % 5]} />
        </mesh>
      );
    });
  }, [data]);

  return <group>{slices}</group>;
}
