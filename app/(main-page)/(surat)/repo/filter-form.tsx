import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect } from "react";
import { PlusCircleIcon } from "lucide-react";
import Select from "react-select";
import { Indikator } from "../../(master)/data-master/(sikoja)/indikator/columns";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

export default function FilterForm({
  onSubmit,
  values,
  isLoading,
}: {
  onSubmit: (data: any) => void;
  values?: any;
  isLoading?: boolean;
}) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [selectedProdi, setSelectedProdi] = useState<number[]>([]);
  const [selectedIku, setSelectedIku] = useState<number[]>([]);
  const [selectedStrategi, setSelectedStrategi] = useState<number[]>([]);
  const [selectedIndikator, setSelectedIndikator] = useState<any[]>([]);

  const { data: prodiData, isLoading: isProdiLoading } = useQuery({
    queryKey: ["prodi"],
    queryFn: async () => {
      const response = await axios.get("/api/prodi");
      return response.data;
    },
  });

  const { data: ikuData, isLoading: isIkuLoading } = useQuery({
    queryKey: ["iku"],
    queryFn: async () => {
      const response = await axios.get("/api/sikoja/iku");
      return response.data;
    },
  });

  const { data: strategiData, isLoading: isStrategiLoading } = useQuery({
    queryKey: ["strategi"],
    queryFn: async () => {
      const response = await axios.get("/api/sikoja/strategi");
      return response.data;
    },
  });

  const { data: indikatorData, isLoading: isIndikatorLoading } = useQuery({
    queryKey: ["indikator"],
    queryFn: async () => {
      const response = await axios.get("/api/sikoja/indikator");
      return response.data.indikator as Indikator[];
    },
  });

  const approvedIndikator = indikatorData?.filter((indikator: any) => {
    if (selectedStrategi.length === 0 && selectedIku.length === 0) return true;

    return (
      selectedStrategi.includes(indikator.strategi.id) ||
      selectedIku.includes(indikator.iku.id)
    );
  });

  useEffect(() => {
    if (selectedIndikator.length === 0) return;
    if (selectedStrategi.length === 0 && selectedIku.length === 0) return;

    // console.log(selectedIndikator);
    // console.log(selectedStrategi);

    setSelectedIndikator(
      selectedIndikator.filter((indikator: any) => {
        return (
          selectedStrategi.includes(indikator.value.strategi) ||
          selectedIku.includes(indikator.value.iku)
        );
      })
    );
  }, [selectedStrategi, selectedIku]);

  if (
    isProdiLoading ||
    isIkuLoading ||
    isStrategiLoading ||
    isIndikatorLoading
  ) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = {
      prodi_id: selectedProdi,
      iku_id: selectedIku,
      strategi_id: selectedStrategi,
      indikator_id: selectedIndikator.map(
        (indikator: any) => indikator.value.id
      ),
    };

    onSubmit(data);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark h-[80vh] flex flex-col">
      <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
        <h3 className="font-medium text-black dark:text-white">
          Filter Repositori
        </h3>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-between p-6.5 h-[90%]"
      >
        <div>
          <div className="mb-4.5">
            <div className="flex justify-between items-center">
              <label className="mb-2.5 block text-black dark:text-white">
                Prodi
              </label>
            </div>
            <Select
              isMulti
              name="prodi_id"
              options={prodiData.map((prodi: any) => ({
                value: prodi.id,
                label: prodi.name,
              }))}
              className="basic-multi-select"
              classNamePrefix="select"
              onChange={(selectedOption: any) => {
                setSelectedProdi(
                  selectedOption.map((option: any) => option.value)
                );
              }}
            />
          </div>

          <div className="mb-4.5">
            <div className="flex justify-between items-center">
              <label className="mb-2.5 block text-black dark:text-white">
                Strategi
              </label>
            </div>
            <Select
              isMulti
              name="strategi_id"
              options={strategiData.map((prodi: any) => ({
                value: prodi.id,
                label: prodi.name,
              }))}
              closeMenuOnSelect={false}
              className="basic-multi-select"
              classNamePrefix="select"
              onChange={(selectedOption: any) => {
                setSelectedStrategi(
                  selectedOption.map((option: any) => option.value)
                );
              }}
            />
          </div>

          <div className="mb-4.5">
            <div className="flex justify-between items-center">
              <label className="mb-2.5 block text-black dark:text-white">
                IKU
              </label>
            </div>
            <Select
              isMulti
              name="iku_id"
              options={strategiData.map((iku: any) => ({
                value: iku.id,
                label: iku.name,
              }))}
              closeMenuOnSelect={false}
              className="basic-multi-select"
              classNamePrefix="select"
              onChange={(selectedOption: any) => {
                setSelectedIku(
                  selectedOption.map((option: any) => option.value)
                );
              }}
            />
          </div>

          <div className="mb-4.5">
            <div className="flex justify-between items-center">
              <label className="mb-2.5 block text-black dark:text-white">
                Indikator
              </label>
            </div>
            <Select
              isMulti
              name="indikator_id"
              options={
                approvedIndikator &&
                approvedIndikator.map((indikator: any) => ({
                  value: {
                    id: indikator.id,
                    name: indikator.name,
                    iku: indikator.iku.id,
                    strategi: indikator.strategi.id,
                  },
                  label: indikator.name,
                }))
              }
              value={
                selectedIndikator &&
                selectedIndikator.map((indikator: any) => ({
                  value: indikator.id,
                  label: indikator.label,
                }))
              }
              closeMenuOnSelect={false}
              className="basic-multi-select"
              classNamePrefix="select"
              onChange={(selectedOption: any) => {
                setSelectedIndikator(
                  selectedOption.map((option: any) => option)
                );
              }}
            />
          </div>
        </div>

        <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray">
          Filter
        </button>
      </form>
    </div>
  );
}
