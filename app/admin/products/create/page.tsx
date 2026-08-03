import CreateProductForm from "../_components/CreateProductForm";
import { getProducts } from "@/lib/api/product";
import { 
  ShoppingCart, 
  Package, 
  DollarSign, 
  Layers, 
  Gamepad2, 
  Image as ImageIcon,
  Loader
} from "lucide-react";

export default function Page() {
    return (
        <div>
            <CreateProductForm/>
        </div>
    );
}