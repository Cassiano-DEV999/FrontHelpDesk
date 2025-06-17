import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "./ui/button"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";

type ModalResolucaoProps = {
  chamadoId: number;
  carregarChamados: () => void;
}

const finalizarSchema = z.object({
  motivoSolucao: z.string().min(1, "Motivo de solução é obrigatório").max(255, "Máximo 255 caracteres"),
  tipoProblema: z.enum(['SOFTWARE', 'HARDWARE', 'REDE']),
});

type FinalizarData = z.infer<typeof finalizarSchema>;

export const ModalResolucao = ({ carregarChamados, chamadoId }: ModalResolucaoProps) => {


  const form = useForm({ resolver: zodResolver(finalizarSchema) });
  const { handleSubmit } = form;
  const finalizarChamado = async (data: FinalizarData) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:8080/api/chamados/finalizar/${chamadoId}`, {
        method: "POST",
        headers: {
          'content-type': "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success("Chamado finalizado com sucesso!");
        carregarChamados();
      } else {
        toast.error("Erro ao finalizar chamado.");
      }
    } catch (error) {
      toast.error("Falha na requisição.");
    }
  };
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Encerrar Chamado</DialogTitle>
        <DialogDescription>
          Preencha como solucionou o problema
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={handleSubmit(finalizarChamado)} className="grid gap-4">
          <FormField
            control={form.control}
            name="tipoProblema"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo do Problema</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="SOFTWARE">Software</SelectItem>
                        <SelectItem value="HARDWARE">Hardware</SelectItem>
                        <SelectItem value="REDE">Rede</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* MOTIVO Solução*/}
          <FormField
            control={form.control}
            name="motivoSolucao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Resolução</FormLabel>
                <FormControl>
                  <Textarea placeholder="Descreva como o Chamado foi resolvido" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter>
            <Button type="submit">Finalizar</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  )
}