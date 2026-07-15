export function MindmapTool({ html }: { html: string }) {
    if (!html) {
        return <p className="text-sm text-slate-500 text-center py-8">Không có sơ đồ tư duy.</p>
    }

    return (
        <iframe
            srcDoc={html}
            title="Sơ đồ tư duy"
            className="w-full h-[500px] rounded-xl border border-slate-200 dark:border-slate-700 bg-white"
        />
    )
}