//��������ļ�·��Ϊ��./source/
//ÿ����Ҫ���ĵĲ������汾�š�UID
//�ȶ���һЩ����
//������
#define MyAppName "���������"
//����ͼ��·���������iss�ű������·��
#define MyAppIcon ".\source\icon.ico"
//����汾��
#define MyAppVersion "1.2.2"
// ������
#define MyAppPublisher "HowCam"
//��ַ
#define MyAppURL "https://www.github.com/HowCam/ClickToChooseARandomName"
//��ִ�г�����
#define MyAppExeName "main.exe"
//��������ļ�·���������iss�ű������·��
#define MyAppExePath "source"
//����Ĭ�ϰ�װĿ¼
#define MyAppInstallPath "C:\ClickToChooseARandomName\"
//����uuid���㹤������Ψһ��GUID
#define MyUid "9BBA7D49-74C0-4908-8C6E-E561CE7C4873"
 
[Setup]
//[Setup]-�����ΰ������ڰ�װ�����ж�س����ȫ������
;ע: AppId��ֵΪ������ʶ��Ӧ�ó���
; ��ҪΪ������װ����ʹ����ͬ��AppIdֵ��
; (��Ҫ�����µ� GUID�����ڲ˵��е�� "����|���� GUID"��)
//ÿ�����򵥶�һ��id�����ǻ���Ϊע���key�ģ������
AppId={{{#MyUid}}
//����װ�������
AppName={#MyAppName}
//����汾��
AppVersion={#MyAppVersion}
//AppVerName={#MyAppName} {#MyAppVersion}
//Ĭ�ϰ�װĿ¼
DefaultDirName={#MyAppInstallPath}
//ʹ���Ѱ�װ�汾��Ŀ¼��װ��Ϊyes��Ĭ��ѡ�����е�Ŀ¼�Ҳ���ѡ��
UsePreviousAppDir=no
//����ʾѡ��ʼ�˵��ļ��� ��ҳ��
DisableProgramGroupPage=yes
//�Թ���Ȩ�����а�װ
PrivilegesRequired=admin
//��װ�����ɺ������ļ��к��ļ���
OutputDir=install\{#MyAppVersion}
OutputBaseFilename={#MyAppName} x64 V{#MyAppVersion}
//ѡ��ѹ��������lzmaΪ7z
Compression=lzma2
//���ù�̬ѹ��������ĵ�
SolidCompression=yes
//��װ��ж�س����ִ����
WizardStyle=modern
//ָ����װ��ж�س���ͼ��
SetupIconFile={#MyAppIcon}
//�������ж��ͼ��
UninstallDisplayIcon={#MyAppIcon}
//��ʼ�˵����飬see[Icons]����
//DefaultGroupName={#MyAppPublisher}\by
//�������-����/ɾ��ҳ���еĳ��������Ϣ
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
AppUpdatesURL={#MyAppURL}
 
[Languages]
//[Languages]-���尲װ�����п�ʹ�õ�����
Name: "english"; MessagesFile: "compiler:Default.isl"
Name: "chinesesimplified"; MessagesFile: "compiler:Languages\ChineseSimplified.isl"
 
[Tasks]
//[Tasks]-���尲װ������ִ�а�װ�ڼ��������û����Ƶ�������Щ������ѡ���͵�ѡ����ʽ�ڸ���������ҳ���г��֡�
//��������ͼ��
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: checkablealone
 
[Files]
//[Files]-���Ƕ��尲װ����װ�ļ����û�ϵͳ�еĿ�ѡ�ļ�����
Source: "{#MyAppExePath}\{#MyAppExeName}"; DestDir: "{app}"; Flags: ignoreversion
Source: "{#MyAppExePath}\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs
//ע��: ��Ҫ���κι���ϵͳ�ļ���ʹ�á�Flags: ignoreversion��
 
[Icons]
//[Icons]-�������д����ڿ�ʼ�˵���/������λ��(��������)�Ŀ�ݷ�ʽ
//see[Setup]����DefaultGroupName����
//ʹ�ò˵�����
//Name: "{group}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; IconFilename:"{app}\{#MyAppIcon}"
//Name: "{group}\{cm:UninstallProgram,{#MyAppName}}"; Filename: "{uninstallexe}"; IconFilename:"{app}\{#MyAppIcon}"
//Name: "{userdesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: desktopicon; IconFilename:"{app}\{#MyAppIcon}"
//û�в˵�����
Name: "{autoprograms}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}";
Name: "{autodesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: desktopicon;
 
[Run]
// [Run]- ����ָ���ڳ�����ɰ�װ���ڰ�װ������ʾ���նԻ���ǰҪִ�е�һЩ����
Filename: "{app}\{#MyAppExeName}"; Description: "{cm:LaunchProgram,{#StringChange(MyAppName, '&', '&&')}}"; Flags: nowait postinstall skipifsilent
 
[Code]
//[Code]-ָ�� Pascal �ű��Ŀ�ѡ����
//·�������������ͣ�
//https://blog.csdn.net/c1007857613/article/details/81475167
//https://www.cnblogs.com/csuftzzk/p/innosetup_read_registry.html
//ȫ�ֱ������氲װ·��
var 
  globalInstallPath: String;
 
//��ʼ��ʱ��·�����õ��༭��
procedure InitializeWizard;
begin
  WizardForm.DirEdit.Text := globalInstallPath;
end;
 
//�������Ƿ�����
function IsAppRunning(const FileName: string): Boolean;
var
  FWMIService: Variant;
  FSWbemLocator: Variant;
  FWbemObjectSet: Variant;
begin
  Result := false;
  FSWbemLocator := CreateOleObject('WBEMScripting.SWBEMLocator');
  FWMIService := FSWbemLocator.ConnectServer('', 'root\CIMV2', '', '');
  FWbemObjectSet := FWMIService.ExecQuery(Format('SELECT Name FROM Win32_Process Where Name="%s"',[FileName]));
  Result := (FWbemObjectSet.Count > 0);
  FWbemObjectSet := Unassigned;
  FWMIService := Unassigned;
  FSWbemLocator := Unassigned;
end;
 
//��ȡ��ʷ��װ·����Inno Setup�����һЩ��Ϣ���Լ���ע����в鿴
//64λ��ӳ�䵽�������\HKEY_LOCAL_MACHINE\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall
function GetInstallString(): String;
var
  InstallPath: String;
begin
  InstallPath := '{#MyAppInstallPath}';
  if RegValueExists(HKLM, 'SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\{{#MyUid}}_is1', 'Inno Setup: App Path') then
    begin
      RegQueryStringValue(HKLM, 'SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\{{#MyUid}}_is1', 'Inno Setup: App Path', InstallPath)
    end;
  result := InstallPath;
end;
 
//׼����װ
function InitializeSetup(): Boolean;  
var  
  ResultStr: String;  
  ResultCode: Integer;  
begin     
  globalInstallPath := GetInstallString();
  result := IsAppRunning('{#MyAppExeName}');
  if result then
    begin
      MsgBox('��⵽{#MyAppName}�������У����ȹرճ��������! ', mbError, MB_OK); 
      result:=false;
    end
  else if RegQueryStringValue(HKLM, 'SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\{{#MyUid}}_is1', 'UninstallString', ResultStr) then
    begin  
    if  MsgBox('�Ƿ�ж���Ѱ�װ��{#MyAppName}����������ʷ���ݣ�', mbConfirmation, MB_YESNO) = IDYES then
      begin  
        ResultStr := RemoveQuotes(ResultStr);  
        Exec(ResultStr, '/silent', '', SW_HIDE, ewWaitUntilTerminated, ResultCode); 
      end;
    result:=true;
    end
  else
    begin
        result:=true; 
    end;
end;
 
//׼��ж��
function InitializeUninstall(): Boolean;
begin
  result := IsAppRunning('{#MyAppExeName}');
  if result then
    begin
      MsgBox('��⵽{#MyAppName}�������У����ȹرճ��������! ', mbError, MB_OK); 
      result:=false;
    end
  else
    begin
      result:=true;
    end
end;