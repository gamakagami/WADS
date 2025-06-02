export default function UserDetailSections({children, title}){
    return(
        <div>
            <h1 className="text-lg font-medium mb-2 mt-4">{title}</h1>
            {children}
        </div>
    )
}