// File: components/QueueTable/helpers.ts

export function formatDateTime(date: string) {
  if (!date) return "-";
  return new Date(date).toLocaleString("en-US");
}

export function statusWithStyle(status: string) {
  if (!status) return "";

  let style = "px-2 py-0.5 rounded-lg font-medium text-xs ";
  let message = "";

  switch (status) {
    case "WAITING":
      style += "bg-yellow-100 border border-yellow-300 text-yellow-700";
      message = "Waiting";
      break;
    case "STARTED":
      style += "bg-blue-100 border border-blue-300 text-blue-700";
      message = "Started";
      break;
    case "PAUSED":
      style += "bg-yellow-100 border border-yellow-300 text-yellow-700";
      message = "Paused";
      break;
    case "CONTINUED":
      style += "bg-blue-100 border border-blue-300 text-blue-700";
      message = "Continued";
      break;
    case "STOPPED":
      style += "bg-green-100 border border-green-300 text-green-700";
      message = "Completed";
      break;
    case "CANCELED":
      style += "bg-red-100 border border-red-300 text-red-700";
      message = "Canceled";
      break;
    case "TRANSFERRED":
      style += "bg-purple-100 border border-purple-300 text-purple-700";
      message = "Transferred";
      break;
    default:
      message = status;
  }

  return <div className={style}>{message}</div>;
}

export function slaCriteria(row: any) {
  const slaMin = row.slaMinDuration || 0;
  const slaMax = row.slaMaxDuration || 0;
  let duration = row.serviceDuration;

  if (!duration) return "-";
  duration = duration / 60;

  if (duration > slaMax) return "Exceeds SLA";
  if (duration < slaMin) return "SLA Met";

  return "Within SLA";
}

export function priorityBadge(isPriority: boolean): JSX.Element {
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
        isPriority
          ? "bg-red-100 text-red-700 border border-red-300"
          : "bg-gray-100 text-gray-600 border border-gray-300"
      }`}
    >
      {isPriority ? "Yes" : "No"}
    </span>
  );
}