import { PlanDetailsPage } from "@/components/plan-details-page"

export default function PlanDetails({ params }: { params: { id: string } }) {
  return <PlanDetailsPage planId={params.id} />
}
