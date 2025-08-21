class Solution {
public:
    bool haveConflict(vector<string>& e1, vector<string>& e2) {
    /****    string start1=event1[0].substr(0,2);
        int start_1=stoi(start1);
        string end1=event1[1].substr(0,2);
        int end_1=stoi(end1);
        string start2=event2[0].substr(0,2);
        int start_2=stoi(start2);
        string end2=event2[1].substr(0,2);
        int end_2=stoi(end2);
        string start2_min=event2[0].substr(3,2);
        int start_2_min=stoi(start2_min);
        string end1_min=event1[1].substr(3,2);
        int end_1_min=stoi(end1_min);
        string start1_min=event1[0].substr(3,2);
        int start_1_min=stoi(start1_min);
        string end2_min=event2[1].substr(3,2);
        int end_2_min=stoi(end2_min);
        //string start1_min=event1[0].substr(3,2);
        //int start_1_min=stoi(start1_min);
        //string start2_min=event2[0].substr(3,2);
        //int start_2_min=stoi(start2_min);
        if(start_2>start_1){
            if(end_1>start_2)
                return true;
            else if(start_2==end_1){
                if(start_2_min<=end_1_min)
                    return true;
                else
                    return false;
            }
            else
                return false;
        }
        else if (start_1>start_2){
            if(start_1<end_2)
                return true;
            else if(start_1==end_2){
                if(start_1_min<=end_2_min)
                    return true;
                else
                    return false;
            }
            else
                return false;
        }
        else{
                if(start_1_min<=start_2_min)
                    return true;
                else
                    return false;
        }
        //return true;
    ****/
    return ((e1[0] <= e2[0]) && (e2[0] <= e1[1])) || ((e2[0] <= e1[0]) && (e1[0] <= e2[1]));    
    }
};